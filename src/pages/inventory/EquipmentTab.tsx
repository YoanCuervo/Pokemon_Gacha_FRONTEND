import type { ReserveItem } from "../../types";
import { FilterBar } from "./FilterBar";
import { ItemGrid } from "./ItemGrid";

interface EquipmentTabProps {
	items: ReserveItem[];
	pokemonType: string | null;
	pokemonTypeSecondary: string | null;
	filterType: string | null;
	filterRarity: string | null;
	onChangeType: (type: string | null) => void;
	onChangeRarity: (rarity: string | null) => void;
	onEquip: (itemInstanceId: number) => void;
}

export function EquipmentTab({
	items,
	pokemonType,
	pokemonTypeSecondary,
	filterType,
	filterRarity,
	onChangeType,
	onChangeRarity,
	onEquip,
}: EquipmentTabProps) {
	return (
		<div className="inventory__tab-content">
			<FilterBar
				filterType={filterType}
				filterRarity={filterRarity}
				onChangeType={onChangeType}
				onChangeRarity={onChangeRarity}
			/>
			<ItemGrid
				items={items}
				pokemonType={pokemonType}
				pokemonTypeSecondary={pokemonTypeSecondary}
				onEquip={onEquip}
			/>
			<div className="inventory__grid-actions">
				<button type="button" className="inventory__btn" disabled>
					MODIFIER
				</button>
				<button type="button" className="inventory__btn" disabled>
					EQUIPER
				</button>
			</div>
		</div>
	);
}
