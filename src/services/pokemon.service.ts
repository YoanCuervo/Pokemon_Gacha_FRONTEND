import type { EvolutionInfo, InstanceDetail, ItemCategory } from "../types";
import { apiGet, apiPatch, apiPost } from "./api";

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

/** Info d'evolution : espece cible, pierre REQUISE (deja choisie par le
 *  back selon shiny/normal), cout effectif, quantite possedee, verdict.
 *  Endpoint separe de la fiche : l'onglet Evolution le recharge apres
 *  une evolution (l'espece a change -> nouvelle cible, nouvelle pierre). */
export function getEvolution(instanceId: number): Promise<EvolutionInfo> {
	return apiGet<EvolutionInfo>(`/pokemon/${instanceId}/evolution`);
}

/** R3 — Evoluer l'instance. Aucun body : le back deduit tout (cible,
 *  pierre, cout) de l'instance. Renvoie la fiche a jour (nouvelle
 *  espece, items/etoiles/niveau/shiny conserves).
 *  Irreversible et couteux : le composant confirme AVANT d'appeler. */
export function evolveInstance(instanceId: number): Promise<InstanceDetail> {
	return apiPost<InstanceDetail>(`/pokemon/${instanceId}/evolve`, {});
}
