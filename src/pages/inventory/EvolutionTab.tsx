import type { EvolutionInfo, UserStone } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";

/** Plancher visuel : 3 lignes de 7 (meme regle que la grille d'items). */
const MIN_CELLS = 21;

interface EvolutionTabProps {
	evolution: EvolutionInfo;
	stones: UserStone[];
}

/** Onglet A — grille des pierres possedees.
 *  Presentationnel pur : le bouton EVOLUER et la confirmation vivent
 *  sous la card (PokemonPanel/InventoryScreen), pas ici.
 *  La pierre REQUISE est placee en premier et mise en avant ; les
 *  autres sont grisees (possedees mais inutiles pour cette evolution). */
export function EvolutionTab({ evolution, stones }: EvolutionTabProps) {
	const requiredId = evolution.stone?.id ?? null;

	// Requise en tete, le reste dans l'ordre du back (tri par type).
	const sorted = [...stones].sort((a, b) => {
		if (a.stone_id === requiredId) return -1;
		if (b.stone_id === requiredId) return 1;
		return 0;
	});

	const emptyCount = Math.max(0, MIN_CELLS - sorted.length);

	return (
		<div className="inventory__tab-content">
			<div className="inventory__grid-wrap">
				<div className="evolution__grid">
					{sorted.map((stone) => {
						const isRequired = stone.stone_id === requiredId;
						return (
							<div
								key={stone.stone_id}
								className={[
									"stone-cell",
									isRequired ? "stone-cell--required" : "stone-cell--inactive",
									stone.type === "shiny" ? "stone-cell--shiny" : "",
								]
									.filter(Boolean)
									.join(" ")}
								title={stone.name}
							>
								<img
									src={itemSpriteUrl(stone.name)}
									alt={stone.name}
									className="stone-cell__icon"
								/>
								<span className="stone-cell__qty">{stone.quantity}</span>
							</div>
						);
					})}
					{Array.from({ length: emptyCount }, (_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: cases de remplissage figées
							key={`empty-${i}`}
							className="stone-cell stone-cell--empty"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
