import type { EquipmentItem, ItemCategory } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";

interface EquipmentSlotProps {
	category: ItemCategory;
	item: EquipmentItem | null;
	selected: boolean;
	onClick: () => void;
}

const CATEGORY_LABEL: Record<ItemCategory, string> = {
	att: "ATT",
	def: "DEF",
	speed: "SPEED",
	spe: "SPE",
};

export function EquipmentSlot({
	category,
	item,
	selected,
	onClick,
}: EquipmentSlotProps) {
	return (
		<button
			type="button"
			className={`equip-slot ${item ? "equip-slot--filled" : ""} ${
				selected ? "equip-slot--selected" : ""
			}`}
			onClick={onClick}
		>
			{item ? (
				<img
					src={itemSpriteUrl(item.name)}
					alt={item.name}
					className="equip-slot__icon"
				/>
			) : (
				<span className="equip-slot__label">{CATEGORY_LABEL[category]}</span>
			)}
		</button>
	);
}
