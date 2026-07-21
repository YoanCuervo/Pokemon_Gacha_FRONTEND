/** Types EN (DB/API) -> FR (affichage). Solde la dette TYPE_FR des
 *  contextes 7/8. Le jour du switch i18n, ce dico sera remplacé par un
 *  t() unique — TypeBadge n'aura pas à changer (il appelle typeNameFr). */
export const TYPE_FR: Record<string, string> = {
	normal: "Normal",
	fire: "Feu",
	water: "Eau",
	electric: "Électrik",
	grass: "Plante",
	ice: "Glace",
	fighting: "Combat",
	poison: "Poison",
	ground: "Sol",
	flying: "Vol",
	psychic: "Psy",
	bug: "Insecte",
	rock: "Roche",
	ghost: "Spectre",
	dragon: "Dragon",
	dark: "Ténèbres",
	steel: "Acier",
	fairy: "Fée",
};

/** Nom FR d'un type, fallback = type capitalisé si absent du dico. */
export function typeNameFr(type: string): string {
	return TYPE_FR[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}
