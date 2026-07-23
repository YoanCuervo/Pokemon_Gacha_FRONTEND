import type { StonesResponse, UserStone } from "../types";
import { apiGet } from "./api";

/** Toutes les pierres possedees du joueur.
 *  Le back renvoie { stones: [...] } ; on deballe pour que l'appelant
 *  manipule directement un tableau (meme pattern que getReserve). */
export async function getStones(): Promise<UserStone[]> {
	const data = await apiGet<StonesResponse>("/stones");
	return data.stones;
}
