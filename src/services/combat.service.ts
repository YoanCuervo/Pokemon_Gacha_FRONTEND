import type { CombatLog } from "../types/combat";
import { apiPost } from "./api";

/** Lance le combat (miroir V1) et retourne le log complet.
 *  Le futur PVE/PVP passera l'adversaire ici — point d'extension. */
export function runCombat(): Promise<CombatLog> {
	return apiPost<CombatLog>("/combat", {});
}
