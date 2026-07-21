const SPRITES_BASE =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

// GIF animé Gen 5 — pour le hub Home
export function animatedSpriteUrl(pokemonId: number, isShiny: boolean): string {
	const variant = isShiny ? "shiny/" : "";
	return `${SPRITES_BASE}/versions/generation-v/black-white/animated/${variant}${pokemonId}.gif`;
}

// Artwork officiel PNG — pour les cards Team
export function artworkUrl(pokemonId: number, isShiny: boolean): string {
	const variant = isShiny ? "shiny/" : "";
	return `${SPRITES_BASE}/other/official-artwork/${variant}${pokemonId}.png`;
}

/** Sprite d'un item (PokeAPI). slug = nom minuscule, apostrophes/points
 *  retires, espaces -> tirets ("Fire Stone" -> "fire-stone").
 *  Derive able, jamais stocke — meme principe que les sprites pokemon. */
export function itemSpriteUrl(itemName: string): string {
	const slug = itemName
		.toLowerCase()
		.replace(/['’.]/g, "")
		.replace(/\s+/g, "-");
	return `${SPRITES_BASE.replace("/pokemon", "")}/items/${slug}.png`;
}
