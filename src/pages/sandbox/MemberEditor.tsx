import { useMemo, useState } from "react";
import { ROLE_FR } from "../../i18n/combat.fr";
import { itemNameFr } from "../../i18n/items.fr";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type {
	CombatRole,
	ItemCatalogEntry,
	SandboxMember,
	SpeciesCatalogEntry,
} from "../../types/combat";
import { animatedSpriteUrl } from "../../utils/sprites";
import { ItemPicker } from "./ItemPicker";
import { SpeciesPicker } from "./SpeciesPicker";

const MAX_LEVEL = 500;
const MAX_STARS = 5;

/** Un membre neuf : le minimum viable, ajustable ensuite. */
function blankMember(pokemonId: number): SandboxMember {
	return {
		pokemon_id: pokemonId,
		level: 50,
		stars: 3,
		is_shiny: false,
		item_template_ids: [],
	};
}

/** Sous-ecran actif : l'editeur lui-meme (null), ou un selecteur.
 *  Les selecteurs sont des sous-ecrans et pas des zones de l'editeur :
 *  251 especes ne tiennent pas dans une modale d'edition. */
type PickingState =
	| { kind: "species" }
	| { kind: "item"; category: ItemCatalogEntry["category"] }
	| null;

const CATEGORY_LABEL: Record<ItemCatalogEntry["category"], string> = {
	att: "ATT",
	def: "DEF",
	speed: "VIT",
	spe: "SPE",
};

interface MemberEditorProps {
	/** Quelle equipe / quel slot on edite (titre de la modale). */
	teamLabel: string;
	slot: number;
	/** null = le slot etait vide, on cree. */
	member: SandboxMember | null;
	species: SpeciesCatalogEntry[];
	items: ItemCatalogEntry[];
	/** Items UNIQUES deja portes ailleurs dans l'equipe : le picker
	 *  les grise (la regle back DUPLICATE_UNIQUE_ITEM, anticipee). */
	usedUniqueIds: number[];
	onSave: (member: SandboxMember) => void;
	onDelete: () => void;
	onCancel: () => void;
}

/** Editeur d'un slot : TOUT sur une page (espece, niveau, etoiles,
 *  shiny, 4 items). Les selecteurs s'ouvrent par-dessus a la demande.
 *  Etat LOCAL : on ne remonte au parent qu'a la validation — annuler
 *  doit vraiment tout annuler, y compris un changement d'espece. */
export function MemberEditor({
	teamLabel,
	slot,
	member,
	species,
	items,
	usedUniqueIds,
	onSave,
	onDelete,
	onCancel,
}: MemberEditorProps) {
	const [draft, setDraft] = useState<SandboxMember | null>(member);

	// Slot vide -> on ouvre directement le selecteur d'espece : sans ca
	// le joueur verrait un editeur sans pokemon.
	const [picking, setPicking] = useState<PickingState>(
		member ? null : { kind: "species" },
	);

	// Les items equipes, resolus depuis le catalogue.
	const equipped = useMemo(() => {
		if (!draft) return [];
		return draft.item_template_ids
			.map((id) => items.find((it) => it.template_id === id))
			.filter((it): it is ItemCatalogEntry => it !== undefined);
	}, [draft, items]);

	/** L'item equipe dans une categorie, ou null. */
	const itemIn = (category: ItemCatalogEntry["category"]) =>
		equipped.find((it) => it.category === category) ?? null;

	function clampLevel(value: number): number {
		if (!Number.isFinite(value)) return 1;
		return Math.min(Math.max(1, Math.round(value)), MAX_LEVEL);
	}

	/** Remplace l'item d'une categorie (ou le retire si null).
	 *  Une categorie ne porte qu'UN item : on filtre l'ancien avant
	 *  (le back refuse les doublons de categorie). */
	function setItem(
		category: ItemCatalogEntry["category"],
		templateId: number | null,
	) {
		if (!draft) return;
		const kept = draft.item_template_ids.filter((id) => {
			const it = items.find((x) => x.template_id === id);
			return it && it.category !== category;
		});
		setDraft({
			...draft,
			item_template_ids: templateId === null ? kept : [...kept, templateId],
		});
		setPicking(null);
	}

	// --- Sous-ecran : choix de l'espece
	if (picking?.kind === "species") {
		return (
			<SpeciesPicker
				species={species}
				onPick={(pokemonId) => {
					setDraft((d) =>
						d ? { ...d, pokemon_id: pokemonId } : blankMember(pokemonId),
					);
					setPicking(null);
				}}
				onCancel={() => {
					// Pas de draft = on creait un membre : annuler ferme tout.
					if (draft) setPicking(null);
					else onCancel();
				}}
			/>
		);
	}

	// --- Sous-ecran : choix d'un item
	if (picking?.kind === "item") {
		const category = picking.category;
		return (
			<ItemPicker
				items={items}
				category={category}
				equippedId={itemIn(category)?.template_id ?? null}
				disabledIds={usedUniqueIds}
				onPick={(templateId) => setItem(category, templateId)}
				onClear={() => setItem(category, null)}
				onCancel={() => setPicking(null)}
			/>
		);
	}

	// --- Éditeur principal (draft garanti non-null ici)
	if (!draft) return null;

	const categories: ItemCatalogEntry["category"][] = [
		"att",
		"def",
		"speed",
		"spe",
	];

	// Le role vient du mode de l'item spe (COMBAT_SPEC 6.1) : slot vide
	// -> Attaquant par defaut. On l'affiche ici pour que le joueur voie
	// l'effet de son choix sans lancer le combat.
	const speItem = itemIn("spe");
	const role: CombatRole = (speItem?.mode as CombatRole) ?? "attacker";

	return (
		<div className="sandbox-modal__overlay">
			<div className="sandbox-modal sandbox-modal--editor">
				<header className="sandbox-modal__header">
					<h2>
						{teamLabel} — SLOT {slot}
					</h2>
					<button
						type="button"
						className="sandbox-modal__change"
						onClick={onCancel}
					>
						✕
					</button>
				</header>

				<div className="editor__body">
					{/* Colonne gauche : identite */}
					<div className="editor__identity">
						<img
							src={animatedSpriteUrl(draft.pokemon_id, draft.is_shiny)}
							alt=""
							className="editor__sprite"
						/>
						<span className="editor__name">
							{pokemonNameFr(draft.pokemon_id)}
							{draft.is_shiny && <span className="inventory__shiny">S</span>}
						</span>
						<button
							type="button"
							className="sandbox-modal__change"
							onClick={() => setPicking({ kind: "species" })}
						>
							CHANGER
						</button>
					</div>

					{/* Colonne droite : les 4 slots d'items, 2x2 */}
					<div className="editor__items">
						{categories.map((category) => {
							const it = itemIn(category);
							return (
								<button
									key={category}
									type="button"
									className={
										it
											? "sandbox-item-slot sandbox-item-slot--filled"
											: "sandbox-item-slot"
									}
									data-rarity={it?.rarity}
									onClick={() => setPicking({ kind: "item", category })}
								>
									<span className="sandbox-item-slot__cat">
										{CATEGORY_LABEL[category]}
									</span>
									<span className="sandbox-item-slot__name">
										{it ? itemNameFr(it.name) : "—"}
									</span>
									{it && (
										<span className="sandbox-item-slot__boost">
											+{it.boost_value}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Réglages : niveau, étoiles, shiny */}
				<div className="editor__fields">
					<label className="sandbox-field">
						<span className="sandbox-field__label">Niveau</span>
						<input
							type="number"
							className="sandbox-field__input"
							value={draft.level}
							min={1}
							max={MAX_LEVEL}
							onChange={(e) =>
								setDraft({
									...draft,
									level: clampLevel(Number(e.target.value)),
								})
							}
						/>
					</label>

					<div className="sandbox-field">
						<span className="sandbox-field__label">Étoiles</span>
						<div className="sandbox-stars">
							{Array.from({ length: MAX_STARS }, (_, i) => {
								const value = i + 1;
								return (
									<button
										key={value}
										type="button"
										className={
											value <= draft.stars
												? "sandbox-stars__btn sandbox-stars__btn--on"
												: "sandbox-stars__btn"
										}
										onClick={() => setDraft({ ...draft, stars: value })}
									>
										★
									</button>
								);
							})}
						</div>
					</div>

					{/* Shiny : cosmetique, aucun effet sur les stats (R4) */}
					<label className="sandbox-field sandbox-field--inline">
						<input
							type="checkbox"
							checked={draft.is_shiny}
							onChange={(e) =>
								setDraft({ ...draft, is_shiny: e.target.checked })
							}
						/>
						<span className="sandbox-field__label">Shiny</span>
					</label>

					{/* Le role est la donnee de theorycrafting : il vient du
					    slot spe et decide du comportement en combat. */}
					<div className="sandbox-field">
						<span className="sandbox-field__label">Rôle</span>
						<span className="editor__role">{ROLE_FR[role]}</span>
					</div>
				</div>

				<div className="sandbox-modal__actions">
					<button type="button" className="inventory__btn" onClick={onCancel}>
						ANNULER
					</button>
					{member && (
						<button
							type="button"
							className="inventory__btn inventory__btn--danger"
							onClick={onDelete}
						>
							VIDER
						</button>
					)}
					<button
						type="button"
						className="inventory__btn"
						onClick={() => onSave(draft)}
					>
						VALIDER
					</button>
				</div>
			</div>
		</div>
	);
}
