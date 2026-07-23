import { itemNameFr } from "../../i18n/items.fr";
import { typeNameFr } from "../../i18n/type.fr";

interface StoneTooltipProps {
	name: string;
	type: string;
	quantity: number;
	/** true si c'est la pierre requise pour cette evolution. */
	required: boolean;
	x: number;
	y: number;
}

/** Tooltip de pierre — meme modele que ItemTooltip (fixed, decale de 14px
 *  du curseur, jamais coupe par le scroll de la grille).
 *  Le pseudo-type 'shiny' n'est pas un type Pokemon : on l'affiche tel quel
 *  plutot que de le passer a typeNameFr qui ne le connait pas. */
export function StoneTooltip({
	name,
	type,
	quantity,
	required,
	x,
	y,
}: StoneTooltipProps) {
	const isShiny = type === "shiny";

	return (
		<div
			className="item-tooltip"
			data-rarity={isShiny ? "legendary" : "common"}
			style={{ left: x + 14, top: y + 14 }}
		>
			<span className="item-tooltip__name">{itemNameFr(name)}</span>
			<span className="item-tooltip__cat">
				{isShiny ? "Pierre Shiny" : `Pierre ${typeNameFr(type)}`}
			</span>
			<span className="item-tooltip__boost">×{quantity}</span>
			{required && (
				<span className="item-tooltip__line">Requise pour cette évolution</span>
			)}
		</div>
	);
}
