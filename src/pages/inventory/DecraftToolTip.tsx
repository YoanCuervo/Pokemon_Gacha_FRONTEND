import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { DecraftableInstance } from "../../types";

interface DecraftTooltipProps {
	instance: DecraftableInstance;
	x: number;
	y: number;
}

export function DecraftTooltip({ instance, x, y }: DecraftTooltipProps) {
	return (
		<div
			className="item-tooltip"
			data-rarity={instance.is_shiny ? "legendary" : "common"}
			style={{ left: x + 14, top: y + 14 }}
		>
			<span className="item-tooltip__name">
				{pokemonNameFr(instance.pokemon_id)}
				{instance.is_shiny && <span className="inventory__shiny">S</span>}
			</span>

			<span className="item-tooltip__cat">
				{instance.stars} ★ · Niveau {instance.level}
			</span>

			<span className="item-tooltip__boost">
				+{instance.fragment_value} fragments
			</span>

			{instance.candy_value > 0 && (
				<span className="item-tooltip__line">
					+{instance.candy_value} bonbons
				</span>
			)}
		</div>
	);
}
