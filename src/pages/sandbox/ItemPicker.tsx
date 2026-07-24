import { useMemo, useState } from "react";
import { ROLE_FR } from "../../i18n/combat.fr";
import { itemNameFr } from "../../i18n/items.fr";
import { typeNameFr } from "../../i18n/type.fr";
import type { CombatRole, ItemCatalogEntry, Rarity } from "../../types/combat";
import { itemSpriteUrl } from "../../utils/sprites";

/** Ordre d'affichage des raretes (croissant) — pas alphabetique. */
const RARITY_ORDER: Rarity[] = [
	"common",
	"rare",
	"ultra_rare",
	"legendary",
	"mythic",
];

const RARITY_LABEL: Record<Rarity, string> = {
	common: "Commun",
	rare: "Rare",
	ultra_rare: "Ultra rare",
	legendary: "Légendaire",
	mythic: "Mythique",
};

const CATEGORY_LABEL: Record<ItemCatalogEntry["category"], string> = {
	att: "Attaque",
	def: "Défense",
	speed: "Vitesse",
	spe: "Spécial",
};

interface ItemPickerProps {
	items: ItemCatalogEntry[];
	/** La categorie du slot en cours : on ne montre QUE ces items.
	 *  Un item ne peut pas changer de slot (COMBAT_SPEC 6.1). */
	category: ItemCatalogEntry["category"];
	/** L'item deja equipe dans ce slot (mis en avant). */
	equippedId: number | null;
	onPick: (templateId: number) => void;
	onClear: () => void;
	onCancel: () => void;
}

/** Selecteur d'item — filtre sur la CATEGORIE du slot, plus la rarete.
 *  Chaque item existe en 5 variantes (une par rarete) : le joueur
 *  choisit un template_id, la rarete et le boost viennent avec.
 *  Le slot spe porte le ROLE de combat : on affiche le mode traduit. */
export function ItemPicker({
	items,
	category,
	equippedId,
	onPick,
	onClear,
	onCancel,
}: ItemPickerProps) {
	const [rarityFilter, setRarityFilter] = useState<Rarity | null>(null);
	const [search, setSearch] = useState("");

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return items
			.filter((it) => it.category === category)
			.filter((it) => (rarityFilter ? it.rarity === rarityFilter : true))
			.filter((it) =>
				q ? itemNameFr(it.name).toLowerCase().includes(q) : true,
			)
			.sort((a, b) => {
				// Rarete croissante, puis nom : le joueur compare des
				// variantes du meme item cote a cote.
				const ra = RARITY_ORDER.indexOf(a.rarity);
				const rb = RARITY_ORDER.indexOf(b.rarity);
				if (ra !== rb) return ra - rb;
				return a.name.localeCompare(b.name);
			});
	}, [items, category, rarityFilter, search]);

	return (
		<div className="sandbox-modal__overlay">
			<div className="sandbox-modal sandbox-modal--picker">
				<header className="sandbox-modal__header">
					<h2>Objet — {CATEGORY_LABEL[category]}</h2>
					<button
						type="button"
						className="sandbox-modal__change"
						onClick={onCancel}
					>
						ANNULER
					</button>
				</header>

				<div className="sandbox-picker__filters">
					<input
						type="text"
						className="sandbox-field__input sandbox-picker__search"
						placeholder="Nom de l'objet…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select
						className="inventory__select"
						value={rarityFilter ?? ""}
						onChange={(e) =>
							setRarityFilter((e.target.value || null) as Rarity | null)
						}
					>
						<option value="">Toutes les raretés</option>
						{RARITY_ORDER.map((r) => (
							<option key={r} value={r}>
								{RARITY_LABEL[r]}
							</option>
						))}
					</select>
					{equippedId !== null && (
						<button
							type="button"
							className="inventory__btn inventory__btn--danger"
							onClick={onClear}
						>
							RETIRER
						</button>
					)}
				</div>

				<div className="sandbox-picker__grid sandbox-picker__grid--items">
					{visible.map((it) => (
						<button
							key={it.template_id}
							type="button"
							className={
								it.template_id === equippedId
									? "item-choice item-choice--equipped"
									: "item-choice"
							}
							data-rarity={it.rarity}
							onClick={() => onPick(it.template_id)}
						>
							<img
								src={itemSpriteUrl(it.name)}
								alt=""
								className="item-choice__icon"
							/>
							<span className="item-choice__name">{itemNameFr(it.name)}</span>
							<span className="item-choice__boost">+{it.boost_value}</span>
							{/* Le mode n'existe que sur le slot spe : c'est le ROLE
							    de combat. Le ?? protege d'un mode inconnu en base. */}
							{it.mode && (
								<span className="item-choice__mode">
									{ROLE_FR[it.mode as CombatRole] ?? it.mode}
								</span>
							)}
							{it.required_type && (
								<span className="item-choice__type">
									{typeNameFr(it.required_type)}
								</span>
							)}
						</button>
					))}
					{visible.length === 0 && (
						<p className="sandbox-picker__empty">Aucun objet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
