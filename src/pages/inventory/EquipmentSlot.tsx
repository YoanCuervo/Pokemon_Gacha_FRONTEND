import { useState } from "react";
import type { EquipmentItem, ItemCategory } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";
import { ItemTooltip } from "./ItemTooltip";

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
	const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

	return (
		<>
			<button
				type="button"
				className={`equip-slot ${item ? "equip-slot--filled" : ""} ${
					selected ? "equip-slot--selected" : ""
				}`}
				data-rarity={item?.rarity ?? undefined}
				onClick={onClick}
				onMouseEnter={(e) => item && setPos({ x: e.clientX, y: e.clientY })}
				onMouseMove={(e) => item && setPos({ x: e.clientX, y: e.clientY })}
				onMouseLeave={() => setPos(null)}
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
			{pos && item && (
				<ItemTooltip
					name={item.name}
					category={item.category}
					rarity={item.rarity}
					boost_value={item.boost_value}
					required_type={item.required_type}
					mode={item.mode}
					x={pos.x}
					y={pos.y}
				/>
			)}
		</>
	);
}
