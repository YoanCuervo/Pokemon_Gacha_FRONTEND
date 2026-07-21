import { useState } from "react";
import type { ReserveItem } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";
import { ItemTooltip } from "./ItemTooltip";

interface ItemCellProps {
	item: ReserveItem;
	incompatible: boolean;
	onClick: () => void;
}

export function ItemCell({ item, incompatible, onClick }: ItemCellProps) {
	const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

	return (
		<>
			<button
				type="button"
				className={`item-cell ${incompatible ? "item-cell--incompatible" : ""}`}
				data-rarity={item.rarity}
				onClick={onClick}
				onMouseEnter={(e) => setPos({ x: e.clientX, y: e.clientY })}
				onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
				onMouseLeave={() => setPos(null)}
			>
				<img
					src={itemSpriteUrl(item.name)}
					alt={item.name}
					className="item-cell__icon"
				/>
			</button>
			{pos && (
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
