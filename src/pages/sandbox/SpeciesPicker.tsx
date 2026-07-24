import { useMemo, useState } from "react";
import { TypeBadge } from "../../components/TypeBadge";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import { typeNameFr } from "../../i18n/type.fr";
import type { SpeciesCatalogEntry } from "../../types/combat";
import { animatedSpriteUrl } from "../../utils/sprites";

interface SpeciesPickerProps {
	species: SpeciesCatalogEntry[];
	onPick: (pokemonId: number) => void;
	onCancel: () => void;
}

/** Selecteur d'espece — les 251, filtrables par nom FR et par type.
 *  Le catalogue est charge une fois par l'ecran parent et filtre EN
 *  MEMOIRE ici (meme pattern que la reserve d'items de l'inventaire) :
 *  251 lignes, aucune raison de rappeler le back a chaque frappe. */
export function SpeciesPicker({
	species,
	onPick,
	onCancel,
}: SpeciesPickerProps) {
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<string | null>(null);

	// Les types presents dans le catalogue, dedoublonnes et tries.
	const types = useMemo(() => {
		const set = new Set<string>();
		for (const s of species) {
			set.add(s.type_primary);
			if (s.type_secondary) set.add(s.type_secondary);
		}
		return [...set].sort();
	}, [species]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return species.filter((s) => {
			// Recherche sur le nom FR : c'est celui que le joueur connait.
			// On tolere aussi le numero du Pokedex ("6" -> Dracaufeu).
			if (q) {
				const nameFr = pokemonNameFr(s.pokemon_id).toLowerCase();
				const matchName = nameFr.includes(q);
				const matchId = String(s.pokemon_id) === q;
				if (!matchName && !matchId) return false;
			}
			if (typeFilter) {
				if (s.type_primary !== typeFilter && s.type_secondary !== typeFilter) {
					return false;
				}
			}
			return true;
		});
	}, [species, search, typeFilter]);

	return (
		<div className="sandbox-modal__overlay">
			<div className="sandbox-modal sandbox-modal--picker">
				<header className="sandbox-modal__header">
					<h2>Choisir un pokémon</h2>
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
						placeholder="Nom ou n° du Pokédex…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select
						className="inventory__select"
						value={typeFilter ?? ""}
						onChange={(e) => setTypeFilter(e.target.value || null)}
					>
						<option value="">Tous les types</option>
						{types.map((t) => (
							<option key={t} value={t}>
								{typeNameFr(t)}
							</option>
						))}
					</select>
					<span className="sandbox-picker__count">{visible.length}</span>
				</div>

				<div className="sandbox-picker__grid">
					{visible.map((s) => (
						<button
							key={s.pokemon_id}
							type="button"
							className="species-cell"
							data-type={s.type_primary}
							onClick={() => onPick(s.pokemon_id)}
						>
							<img
								src={animatedSpriteUrl(s.pokemon_id, false)}
								alt={pokemonNameFr(s.pokemon_id)}
								className="species-cell__sprite"
							/>
							<span className="species-cell__name">
								{pokemonNameFr(s.pokemon_id)}
							</span>
							<span className="species-cell__types">
								<TypeBadge type={s.type_primary} />
								{s.type_secondary && <TypeBadge type={s.type_secondary} />}
							</span>
						</button>
					))}
					{visible.length === 0 && (
						<p className="sandbox-picker__empty">Aucun résultat.</p>
					)}
				</div>
			</div>
		</div>
	);
}
