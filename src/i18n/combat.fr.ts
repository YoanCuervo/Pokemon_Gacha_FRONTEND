// =====================================================================
// i18n/combat.fr.ts — Libellés français du combat (v1, 19/07/2026)
// Le log transporte des codes techniques en anglais (types/combat.ts) ;
// ce fichier les traduit pour l'affichage. Record<CombatRole, string> :
// si le contrat gagne un rôle, tsc exige le libellé manquant ici.
// Futur i18n : ces objets deviendront le contenu du fichier fr.json.
// =====================================================================

import type { CombatRole, TeamKey } from "../types/combat";

/** Libellé du losange de rôle sur la carte. */
export const ROLE_FR: Record<CombatRole, string> = {
	attacker: "Attaquant",
	taunt: "Défenseur",
	crit: "Critique",
	anticrit: "Anti-critique",
	heal_left: "Soigneur (gauche)",
	heal_right: "Soigneur (droite)",
	heal_random: "Soigneur (aléatoire)",
	heal_lowest: "Soigneur (plus faible)",
	heal_adjacent: "Soigneur (voisins)",
	heal_all: "Soigneur (équipe)",
	atk_adjacent: "Double-lames",
};

/** Écran de fin : libellé selon le résultat du log et l'équipe du joueur. */
export function resultLabelFr(
	result: TeamKey | "draw",
	myTeamKey: TeamKey,
): "VICTOIRE" | "DÉFAITE" | "ÉGALITÉ" {
	if (result === "draw") return "ÉGALITÉ";
	return result === myTeamKey ? "VICTOIRE" : "DÉFAITE";
}
