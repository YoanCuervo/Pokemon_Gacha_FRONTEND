import type {
	CombatLog,
	ItemCatalogEntry,
	SandboxPayload,
	SandboxPreview,
	SpeciesCatalogEntry,
} from "../types/combat";
import { apiGet, apiPost } from "./api";

/** Le catalogue des 251 especes. Charge une fois au montage de l'ecran,
 *  filtre en memoire ensuite (meme pattern que la reserve d'items). */
export async function getSpeciesCatalog(): Promise<SpeciesCatalogEntry[]> {
	const res = await apiGet<{ species: SpeciesCatalogEntry[] }>(
		"/sandbox/species",
	);
	return res.species;
}

/** Le catalogue complet des items equipables (5 raretes par item). */
export async function getItemCatalog(): Promise<ItemCatalogEntry[]> {
	const res = await apiGet<{ items: ItemCatalogEntry[] }>("/sandbox/items");
	return res.items;
}

/** Stats des deux compos SANS lancer le combat.
 *  Appele a chaque modification (debounce cote composant) : c'est le
 *  back qui calcule, jamais le front — la preview doit etre exactement
 *  ce qui entrera en combat. */
export function previewSandbox(
	payload: SandboxPayload,
): Promise<SandboxPreview> {
	return apiPost<SandboxPreview>("/sandbox/preview", payload);
}

/** Lance le combat et renvoie le log, a rejouer sur /combat. */
export function runSandboxCombat(payload: SandboxPayload): Promise<CombatLog> {
	return apiPost<CombatLog>("/sandbox/combat", payload);
}
