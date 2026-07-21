import type { ReserveItem } from "../../types";
import { ItemCell } from "./ItemCell";

interface ItemGridProps {
	items: ReserveItem[];
	pokemonType: string | null;
	pokemonTypeSecondary: string | null;
	onEquip: (itemInstanceId: number) => void;
}

// 3 lignes de 7 colonnes = plancher visuel ; au-delà, la grille scrolle.
const MIN_CELLS = 21;

export function ItemGrid({
	items,
	pokemonType,
	pokemonTypeSecondary,
	onEquip,
}: ItemGridProps) {
	// Au moins MIN_CELLS cases (grille pleine même avec peu d'items), et
	// autant que d'items au-delà (le conteneur scrolle via max-height CSS).
	const cellCount = Math.max(MIN_CELLS, items.length);
	const cells = Array.from({ length: cellCount }, (_, i) => ({
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
