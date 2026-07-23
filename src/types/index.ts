export type ItemCategory = "att" | "def" | "speed" | "spe";

export type ItemRarity =
	| "common"
	| "rare"
	| "ultra_rare"
	| "legendary"
	| "mythic";
export type ItemMode =
	| "hp"
	| "taunt"
	| "crit"
	| "anticrit"
	| "heal_left"
	| "heal_right"
	| "heal_random"
	| "heal_lowest"
	| "heal_adjacent";

export interface EquippedItem {
	id: number;
	name: string;
	category: ItemCategory;
	mode: ItemMode | null;
	boost_value: number;
}

export interface ComputedStats {
	atk: number;
	hp: number;
	def: number;
	speed: number;
}

export interface TeamMember {
	slot_position: number;
	instance_id: number;
	pokemon_id: number;
	name: string;
	type_primary: string;
	type_secondary: string | null;
	stars: number;
	level: number;
	is_shiny: boolean;
	items: EquippedItem[];
	stats: ComputedStats;
}

export interface TeamResponse {
	members: TeamMember[];
	total_speed: number;
}

export interface BoxInstance {
	instance_id: number;
	pokemon_id: number;
	name: string;
	type_primary: string;
	type_secondary: string | null;
	level: number;
	stars: number;
	is_shiny: boolean;
}

export interface BoxResponse {
	instances: BoxInstance[];
}

export type Photo = {
	id: number;
	slot_position: number;
	file_path: string;
};

export type PhotosResponse = {
	photos: Photo[];
	active_photo_id: number | null;
};

export type User = {
	id: number;
	display_name: string;
	country: string | null;
	level: number;
	xp: number;
	active_avatar_id: number | null;
};

export type CountryList = Record<string, string>;

export interface EquipmentItem {
	id: number;
	name: string;
	category: ItemCategory;
	required_type: string | null;
	mode: ItemMode | null;
	boost_value: number;
	rarity: ItemRarity;
}

export interface EquipSlot {
	category: ItemCategory;
	item: EquipmentItem | null;
}

export interface InstanceIdentity {
	instance_id: number;
	pokemon_id: number;
	name: string;
	type_primary: string;
	type_secondary: string | null;
	level: number;
	stars: number;
	is_shiny: boolean;
}

export interface InstanceDetail {
	instance: InstanceIdentity;
	equipped: EquipSlot[];
}

export interface ReserveItem {
	id: number;
	template_id: number;
	name: string;
	category: ItemCategory;
	required_type: string | null;
	mode: ItemMode | null;
	rarity: ItemRarity;
	boost_value: number;
	item_level: number;
}

export interface ReserveResponse {
	items: ReserveItem[];
}

export interface EvolutionInfo {
	instance_id: number;
	current: { pokemon_id: number; name: string };
	target: { pokemon_id: number; name: string } | null;
	stone: { id: number; name: string; type: string } | null;
	stone_cost: number | null;
	stones_owned: number;
	is_shiny_evolution: boolean;
	can_evolve: boolean;
}

export interface UserStone {
	stone_id: number;
	name: string;
	type: string;
	quantity: number;
}

export interface StonesResponse {
	stones: UserStone[];
}

export interface DecraftableInstance {
	instance_id: number;
	pokemon_id: number;
	name: string;
	stars: number;
	level: number;
	is_shiny: boolean;
	fragment_value: number;
	candy_value: number;
}

export interface PowerState {
	instance_id: number;
	stars: number;
	fragments_owned: number;
	next_star_cost: number | null;
	can_upgrade: boolean;
	decraftable: DecraftableInstance[];
}

export interface DecraftResult {
	sacrificed_count: number;
	fragments_gained: number;
	candies_gained: number;
	state: PowerState;
}
