import type { ReserveItem } from "../../types";
import { ItemCell } from "./ItemCell";

interface ItemGridProps {
	items: ReserveItem[];
	pokemonType: string | null;
	pokemonTypeSecondary: string | null;
	onEquip: (itemInstanceId: number) => void;
}

const GRID_SIZE = 15;

export function ItemGrid({
	items,
	pokemonType,
	pokemonTypeSecondary,
	onEquip,
}: ItemGridProps) {
	// Cellules avec clé stable : l'id de l'item si présent, sinon une clé
	// de position fixe (les cases vides ne bougent jamais).
	const cells = Array.from({ length: GRID_SIZE }, (_, i) => ({
		key: items[i] ? `item-${items[i].id}` : `empty-${i}`,
		item: items[i] ?? null,
	}));

	return (
		<div className="inventory__grid">
			{cells.map(({ key, item }) => {
				if (!item) {
					return <div key={key} className="item-cell item-cell--empty" />;
				}
				const incompatible =
					item.required_type !== null &&
					item.required_type !== pokemonType &&
					item.required_type !== pokemonTypeSecondary;
				return (
					<ItemCell
						key={key}
						item={item}
						incompatible={incompatible}
						onClick={() => onEquip(item.id)}
					/>
				);
			})}
		</div>
	);
}
