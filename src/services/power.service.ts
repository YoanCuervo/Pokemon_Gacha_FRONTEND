import type { DecraftResult, PowerState } from "../types";
import { apiGet, apiPost } from "./api";

/** Etat PUISSANCE : etoiles, pot de fragments, cout du prochain palier,
 *  et la liste des doublons sacrifiables avec leur rendement. */
export function getPower(instanceId: number): Promise<PowerState> {
	return apiGet<PowerState>(`/pokemon/${instanceId}/power`);
}

/** R2 — Monter une etoile. Aucun body : le back deduit le cout du
 *  palier vise. Renvoie l'etat a jour. */
export function upgradeStar(instanceId: number): Promise<PowerState> {
	return apiPost<PowerState>(`/pokemon/${instanceId}/star`, {});
}

/** R1 — Decrafter des doublons. DESTRUCTIF et irreversible : le
 *  composant confirme AVANT d'appeler. Le back refuse tout le lot si
 *  une seule instance est invalide (en equipe, autre ligne, la cible).
 *  Renvoie ce qui a ete gagne + l'etat a jour. */
export function decraftInstances(
	instanceId: number,
	instanceIds: number[],
): Promise<DecraftResult> {
	return apiPost<DecraftResult>(`/pokemon/${instanceId}/decraft`, {
		instance_ids: instanceIds,
	});
}
