import type { InstanceDetail, ItemCategory } from "../types";
import { apiGet, apiPatch } from "./api";

/** Fiche d'une instance : identite + etat + 4 slots equipes.
 *  Point de jonction : appele depuis InventoryPage (route) et, plus
 *  tard, depuis Collection. Agnostique de son origine. */
export function getInstance(instanceId: number): Promise<InstanceDetail> {
	return apiGet<InstanceDetail>(`/pokemon/${instanceId}`);
}

/** R5 — Equiper un item (remplacement atomique cote back).
 *  Le slot est deduit de la categorie de l'item cote serveur : on
 *  n'envoie que l'item. Renvoie la fiche a jour. */
export function equipItem(
	instanceId: number,
	itemInstanceId: number,
): Promise<InstanceDetail> {
	return apiPatch<InstanceDetail>(`/pokemon/${instanceId}/equip`, {
		item_instance_id: itemInstanceId,
	});
}

/** R5 — Desequiper un slot (categorie). Idempotent cote back.
 *  Renvoie la fiche a jour. */
export function unequipItem(
	instanceId: number,
	category: ItemCategory,
): Promise<InstanceDetail> {
	return apiPatch<InstanceDetail>(`/pokemon/${instanceId}/unequip`, {
		category,
	});
}
