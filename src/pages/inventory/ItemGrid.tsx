import type { ReserveItem } from "../../types";
import { ItemCell } from "./ItemCell";

interface ItemGridProps {
	items: ReserveItem[];
	pokemonType: string | null;
	pokemonTypeSecondary: string | null;
	onEquip: (itemInstanceId: number) => void;
}

export function ItemGrid({
	items,
	pokemonType,
	pokemonTypeSecondary,
	onEquip,
}: ItemGridProps) {
	if (items.length === 0) {
		return <p className="inventory__empty">Aucun item.</p>;
	}

	return (
		<div className="inventory__grid">
			{items.map((item) => {
				// Grisage : item de type incompatible avec le porteur.
				// required_type null = universel (jamais grisé).
				const incompatible =
					item.required_type !== null &&
					item.required_type !== pokemonType &&
					item.required_type !== pokemonTypeSecondary;
				return (
					<ItemCell
						key={item.id}
						item={item}
						incompatible={incompatible}
						onClick={() => onEquip(item.id)}
					/>
				);
			})}
		</div>
	);
}
