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
	onPrimaryAction: () => void;
}

export function PokemonPanel({
	instance,
	equipped,
	selectedCategory,
	onSelectSlot,
	onPrimaryAction,
}: PokemonPanelProps) {
	const slotByCategory = (cat: ItemCategory) =>
		equipped.find((s) => s.category === cat);

	const left: ItemCategory[] = ["att", "spe"];
	const right: ItemCategory[] = ["def", "speed"];

	// Item present dans le slot selectionne ? -> decide le label du bouton.
	const selectedSlotItem = selectedCategory
		? (slotByCategory(selectedCategory)?.item ?? null)
		: null;

	// Label dynamique : rien selectionne -> desactive ; slot vide -> ANNULER ;
	// slot rempli -> DESEQUIPER.
	const primaryLabel = selectedSlotItem ? "DÉSÉQUIPER" : "ANNULER";
	const primaryDisabled = selectedCategory === null;

	const renderSlot = (cat: ItemCategory) => {
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
	};

	return (
		<div className="inventory__panel">
			<div className="inventory__slots-wrap">
				<div className="inventory__slots">{left.map(renderSlot)}</div>

				{/* Card pokémon : type + nom + png + niveau + étoiles UNIQUEMENT */}
				<div className="inventory__card">
					<img
						src={artworkUrl(instance.pokemon_id, instance.is_shiny)}
						alt={instance.name}
						className="inventory__artwork"
					/>
					<div className="inventory__card-info">
						<div className="inventory__identity">
							<TypeBadge type={instance.type_primary} />
							{instance.type_secondary && (
								<TypeBadge type={instance.type_secondary} />
							)}
							<span className="inventory__name">
								{pokemonNameFr(instance.pokemon_id)}
								{instance.is_shiny && (
									<span className="inventory__shiny">★</span>
								)}
							</span>
						</div>
						<span className="inventory__meta">
							Nv {instance.level} — {"★".repeat(instance.stars)}
						</span>
					</div>
				</div>

				<div className="inventory__slots">{right.map(renderSlot)}</div>
			</div>

			<div className="inventory__actions">
				<button
					type="button"
					className="inventory__btn"
					disabled={primaryDisabled}
					onClick={onPrimaryAction}
				>
					{primaryLabel}
				</button>
				<button type="button" className="inventory__btn" disabled>
					LEVEL UP
				</button>
			</div>
		</div>
	);
}
