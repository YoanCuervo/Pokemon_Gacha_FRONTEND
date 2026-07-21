import { itemNameFr } from "../../i18n/items.fr";
import { typeNameFr } from "../../i18n/type.fr";
import type { ItemCategory, ItemMode, ItemRarity } from "../../types";

interface ItemTooltipProps {
	name: string;
	category: ItemCategory;
	rarity: ItemRarity;
	boost_value: number;
	required_type: string | null;
	mode: ItemMode | null;
	x: number;
	y: number;
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

/** Tooltip d'item, positionné en fixed à (x, y) — jamais coupé par le
 *  scroll de la grille (contrairement à un absolute enfant du conteneur).
 *  Rendu par ItemCell et EquipmentSlot, décalé au-dessus/à droite du curseur. */
export function ItemTooltip({
	name,
	category,
	rarity,
	boost_value,
	required_type,
	mode,
	x,
	y,
}: ItemTooltipProps) {
	return (
		<div
			className="item-tooltip"
			data-rarity={rarity}
			style={{ left: x + 14, top: y + 14 }}
		>
			<span className="item-tooltip__name">{itemNameFr(name)}</span>
			<span className="item-tooltip__cat">
				{CATEGORY_LABEL[category] ?? category} ·{" "}
				{RARITY_LABEL[rarity] ?? rarity}
			</span>
			<span className="item-tooltip__boost">+{boost_value}</span>
			{required_type && (
				<span className="item-tooltip__line">
					Type requis : {typeNameFr(required_type)}
				</span>
			)}
			{mode && <span className="item-tooltip__line">Effet : {mode}</span>}
		</div>
	);
}
