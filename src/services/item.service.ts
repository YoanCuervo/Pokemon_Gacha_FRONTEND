import type { ReserveItem, ReserveResponse } from "../types";
import { apiGet } from "./api";

/** La reserve d'items equipables (non equipes) du joueur.
 *  Le back renvoie tout ; le front filtre en memoire (slot + type +
 *  rarete). On deballe { items } -> ReserveItem[] pour l'appelant. */
export async function getReserve(): Promise<ReserveItem[]> {
	const res = await apiGet<ReserveResponse>("/items/reserve");
	return res.items;
}
