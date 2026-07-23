import { useState } from "react";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { DecraftableInstance } from "../../types";
import { artworkUrl } from "../../utils/sprites";
import { DecraftTooltip } from "./DecraftToolTip";

/** Plancher visuel : 3 lignes de 7 (meme regle que les autres onglets). */
const MIN_CELLS = 21;
const MAX_STARS = 5;

interface PowerTabProps {
	decraftable: DecraftableInstance[];
	/** Ids selectionnes (etat porte par le parent : la modale en a besoin). */
	selectedIds: number[];
	onToggleSelect: (instanceId: number) => void;
	onOpenConfirm: () => void;
}

/** Onglet B — grille des doublons sacrifiables.
 *  Un "doublon" = une instance de la meme ligne evolutive, hors equipe
 *  et hors cible (le back filtre, le front affiche).
 *  Selection multiple : chaque case se coche/decoche au clic.
 *  Le bouton USE (montee d'etoile) vit sous la card, pas ici. */
export function PowerTab({
	decraftable,
	selectedIds,
	onToggleSelect,
	onOpenConfirm,
}: PowerTabProps) {
	const [hover, setHover] = useState<{
		instance: DecraftableInstance;
		x: number;
		y: number;
	} | null>(null);

	const emptyCount = Math.max(0, MIN_CELLS - decraftable.length);
	const hasSelection = selectedIds.length > 0;

	return (
		<div className="inventory__tab-content">
			<div className="inventory__grid-wrap">
				{decraftable.length === 0 ? (
					<p className="power__empty">
						Aucun doublon disponible. Les pokémon de ton équipe ne peuvent pas
						être sacrifiés.
					</p>
				) : (
					<div className="power__grid">
						{decraftable.map((inst) => {
							const selected = selectedIds.includes(inst.instance_id);
							return (
								<button
									key={inst.instance_id}
									type="button"
									className={[
										"decraft-cell",
										selected ? "decraft-cell--selected" : "",
										inst.is_shiny ? "decraft-cell--shiny" : "",
									]
										.filter(Boolean)
										.join(" ")}
									onClick={() => onToggleSelect(inst.instance_id)}
									onMouseEnter={(e) =>
										setHover({ instance: inst, x: e.clientX, y: e.clientY })
									}
									onMouseMove={(e) =>
										setHover({ instance: inst, x: e.clientX, y: e.clientY })
									}
									onMouseLeave={() => setHover(null)}
								>
									<img
										src={artworkUrl(inst.pokemon_id, inst.is_shiny)}
										alt={pokemonNameFr(inst.pokemon_id)}
										className="decraft-cell__icon"
									/>
									{/* Bandeau d'etoiles vertical, meme langage que la card */}
									<span className="decraft-cell__stars">
										{Array.from({ length: MAX_STARS }, (_, i) => (
											<span
												key={i}
												className={
													i < inst.stars
														? "decraft-cell__star"
														: "decraft-cell__star decraft-cell__star--empty"
												}
											>
												★
											</span>
										))}
									</span>
									<span className="decraft-cell__level">Nv {inst.level}</span>
								</button>
							);
						})}
						{Array.from({ length: emptyCount }, (_, i) => (
							<div
								key={`empty-${i}`}
								className="decraft-cell decraft-cell--empty"
							/>
						))}
					</div>
				)}
			</div>

			<div className="inventory__grid-actions">
				<button
					type="button"
					className="inventory__btn"
					disabled={!hasSelection}
					onClick={onOpenConfirm}
				>
					CRAFTER{hasSelection ? ` (${selectedIds.length})` : ""}
				</button>
			</div>
			{hover && (
				<DecraftTooltip instance={hover.instance} x={hover.x} y={hover.y} />
			)}
		</div>
	);
}
