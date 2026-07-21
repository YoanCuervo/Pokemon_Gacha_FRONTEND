import type { ItemRarity } from "../../types";

interface FilterBarProps {
	filterType: string | null;
	filterRarity: string | null;
	onChangeType: (type: string | null) => void;
	onChangeRarity: (rarity: string | null) => void;
}

const RARITIES: ItemRarity[] = [
	"common",
	"rare",
	"ultra_rare",
	"legendary",
	"mythic",
];

// Types Gen 1-2 (18). Le filtre by type cible required_type des items.
const TYPES = [
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
];

export function FilterBar({
	filterType,
	filterRarity,
	onChangeType,
	onChangeRarity,
}: FilterBarProps) {
	return (
		<div className="inventory__filters">
			<label className="inventory__filter">
				by type
				<select
					value={filterType ?? ""}
					onChange={(e) => onChangeType(e.target.value || null)}
				>
					<option value="">tous</option>
					{TYPES.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</label>

			<label className="inventory__filter">
				by rarity
				<select
					value={filterRarity ?? ""}
					onChange={(e) => onChangeRarity(e.target.value || null)}
				>
					<option value="">toutes</option>
					{RARITIES.map((r) => (
						<option key={r} value={r}>
							{r}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
