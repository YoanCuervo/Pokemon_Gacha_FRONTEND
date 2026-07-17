import type { CountryList } from "../types";

/** Code ISO alpha-2 -> URL du drapeau. flagcdn attend des minuscules. */
export function flagUrl(country: string, width = 40): string {
	return `https://flagcdn.com/w${width}/${country.toLowerCase()}.png`;
}

/**
 * La liste des pays vit chez flagcdn, pas en base : les codes ISO sont
 * universels, les dupliquer ne servirait qu'a les laisser vieillir.
 */
export async function fetchCountries(): Promise<CountryList> {
	const res = await fetch("https://flagcdn.com/fr/codes.json");
	if (!res.ok) throw new Error("Liste des pays indisponible");
	return res.json();
}
