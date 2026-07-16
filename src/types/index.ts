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
