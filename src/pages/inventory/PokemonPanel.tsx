import { TypeBadge } from "../../components/TypeBadge";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { EquipSlot, InstanceIdentity, ItemCategory } from "../../types";
import { artworkUrl } from "../../utils/sprites";
import { EquipmentSlot } from "./EquipmentSlot";

interface PokemonPanelProps {
	instance: InstanceIdentity;
	equipped: EquipSlot[];
	selectedCategory: ItemCategory | null;
	onSelectSlot: (category: ItemCategory) => void;
	onUnequip: (category: ItemCategory) => void;
}

export function PokemonPanel({
	instance,
	equipped,
	selectedCategory,
	onSelectSlot,
	onUnequip,
}: PokemonPanelProps) {
	// Les 4 slots viennent deja tries att/def/speed/spe du back.
	const slotByCategory = (cat: ItemCategory) =>
		equipped.find((s) => s.category === cat);

	// Disposition wireframe : att & spe a gauche, def & speed a droite.
	const left: ItemCategory[] = ["att", "spe"];
	const right: ItemCategory[] = ["def", "speed"];

	return (
		<div className="inventory__panel">
			<header className="inventory__identity">
				<TypeBadge type={instance.type_primary} />
				{instance.type_secondary && (
					<TypeBadge type={instance.type_secondary} />
				)}
				<h2 className="inventory__name">
					{pokemonNameFr(instance.pokemon_id)}
					{instance.is_shiny && <span className="inventory__shiny">★</span>}
				</h2>
			</header>

			<div className="inventory__stage">
				<div className="inventory__slots inventory__slots--left">
					{left.map((cat) => {
						const slot = slotByCategory(cat);
						return (
							<EquipmentSlot
								key={cat}
								category={cat}
								item={slot?.item ?? null}
								selected={selectedCategory === cat}
								onClick={() => onSelectSlot(cat)}
							/>
						);
					})}
				</div>

				<img
					src={artworkUrl(instance.pokemon_id, instance.is_shiny)}
					alt={instance.name}
					className="inventory__artwork"
				/>

				<div className="inventory__slots inventory__slots--right">
					{right.map((cat) => {
						const slot = slotByCategory(cat);
						return (
							<EquipmentSlot
								key={cat}
								category={cat}
								item={slot?.item ?? null}
								selected={selectedCategory === cat}
								onClick={() => onSelectSlot(cat)}
							/>
						);
					})}
				</div>
			</div>

			<p className="inventory__meta">
				Nv {instance.level} — {"★".repeat(instance.stars)}
			</p>

			<div className="inventory__actions">
				<button
					type="button"
					className="inventory__btn"
					disabled={!selectedCategory}
					onClick={() => selectedCategory && onUnequip(selectedCategory)}
				>
					DÉSÉQUIPER
				</button>
				<button type="button" className="inventory__btn" disabled>
					LEVEL UP
				</button>
			</div>
		</div>
	);
}
