import type { ReserveItem } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";

interface ItemCellProps {
	item: ReserveItem;
	incompatible: boolean;
	onClick: () => void;
}

export function ItemCell({ item, incompatible, onClick }: ItemCellProps) {
	return (
		<button
			type="button"
			className={`item-cell ${incompatible ? "item-cell--incompatible" : ""}`}
			data-rarity={item.rarity}
			onClick={onClick}
			title={item.name}
		>
			<img
				src={itemSpriteUrl(item.name)}
				alt={item.name}
				className="item-cell__icon"
			/>
		</button>
	);
}
