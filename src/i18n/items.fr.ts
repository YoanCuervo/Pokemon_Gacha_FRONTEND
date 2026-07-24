// =====================================================================
// i18n/items.fr.ts — Noms français des items + formateur d'effet.
// Les noms EN du catalogue (item_templates.name) sont la clé ; les
// libellés FR sont les traductions officielles Pokémon. Fallback :
// nom EN tel quel (item ajouté au catalogue sans traduction — le jeu
// ne casse pas, il parle anglais le temps qu'on complète).
// =====================================================================

import type { SetupItem } from "../types/combat";

/** name EN (catalogue) -> nom FR officiel. */
const ITEM_FR: Record<string, string> = {
	// Uniques
	"Choice Band": "Bandeau Choix",
	Leftovers: "Restes",
	"Choice Scarf": "Mouchoir Choix",
	"Life Orb": "Orbe Vie",
	"Grip Claw": "Griffe Accro",

	// Items de type — att
	"Dragon Fang": "Croc Dragon",
	Charcoal: "Charbon",
	"Black Belt": "Ceinture Noire",
	"Spell Tag": "Rune Sort",
	"Light Ball": "Balle Lumière",
	"Never-Melt Ice": "Glace Éternelle",
	"Soft Sand": "Sable Doux",
	"Hard Stone": "Pierre Dure",
	"Twisted Spoon": "Cuillère Tordue",

	// Items de type — def
	"Black Glasses": "Lunettes Noires",
	"Iron Plate": "Aire Fer",
	"Mystic Water": "Eau Mystique",
	"Miracle Seed": "Graine Miracle",
	"Poison Barb": "Pic Venin",
	"Sharp Beak": "Bec Pointu",
	"Silk Scarf": "Mouchoir Soie",
	"Silver Powder": "Poudre Argentée",

	// Speed / spe
	"Quick Claw": "Vive Griffe",
	"Scope Lens": "Lentilscope",
	"Focus Sash": "Ceinture Force",
};

/** Nom FR d'un item, nom EN en fallback. */
export function itemNameFr(name: string): string {
	return ITEM_FR[name] ?? name;
}

/** Libellé de la stat boostée, par catégorie de slot. */
const CATEGORY_STAT_FR: Record<SetupItem["category"], string> = {
	att: "ATT",
	def: "DEF",
	speed: "VIT",
	spe: "SPE",
};

/** L'effet chiffré d'un item : "+40 ATT". */
export function itemEffectFr(item: SetupItem): string {
	return `+${item.boost} ${CATEGORY_STAT_FR[item.category]}`;
}
