import { itemNameFr } from "../../i18n/items.fr";
import { typeNameFr } from "../../i18n/type.fr";
import type { ReserveItem } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";

interface ItemCellProps {
	item: ReserveItem;
	incompatible: boolean;
	onClick: () => void;
}

const RARITY_LABEL: Record<string, string> = {
	common: "Commun",
	rare: "Rare",
	ultra_rare: "Ultra rare",
	legendary: "Légendaire",
	mythic: "Mythique",
};

const CATEGORY_LABEL: Record<string, string> = {
	att: "Attaque",
	def: "Défense",
	speed: "Vitesse",
	spe: "Spécial",
};

export function ItemCell({ item, incompatible, onClick }: ItemCellProps) {
	return (
		<button
			type="button"
			className={`item-cell ${incompatible ? "item-cell--incompatible" : ""}`}
			data-rarity={item.rarity}
			onClick={onClick}
		>
			<img
				src={itemSpriteUrl(item.name)}
				alt={item.name}
				className="item-cell__icon"
			/>

			{/* Hover card : infos de l'item */}
			<div className="item-tooltip">
				<span className="item-tooltip__name">{itemNameFr(item.name)}</span>
				<span className="item-tooltip__line">
					{CATEGORY_LABEL[item.category] ?? item.category} ·{" "}
					{RARITY_LABEL[item.rarity] ?? item.rarity}
				</span>
				<span className="item-tooltip__line">Boost +{item.boost_value}</span>
				{item.required_type && (
					<span className="item-tooltip__line">
						Type requis : {typeNameFr(item.required_type)}
					</span>
				)}
				{item.mode && (
					<span className="item-tooltip__line">Effet : {item.mode}</span>
				)}
			</div>
		</button>
	);
}
