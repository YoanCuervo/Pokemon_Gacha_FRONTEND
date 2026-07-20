// =====================================================================
// pages/combat/RoleIcon.tsx — Icône du rôle (remplace le texte sur la
// carte ; le libellé FR reste en title/tooltip via ROLE_FR).
// Mapping : attaquant=Sword, défenseur(taunt)=Shield, soins=HandHeart,
// double-lames=Swords, crit=Crosshair. anticrit : Shield (déprécié,
// plus au catalogue — présent pour l'exhaustivité du Record).
// =====================================================================

import {
	Crosshair,
	HandHeart,
	type LucideIcon,
	Shield,
	Sword,
	Swords,
} from "lucide-react";
import type { CombatRole } from "../../types/combat";

const ROLE_ICON: Record<CombatRole, LucideIcon> = {
	attacker: Sword,
	taunt: Shield,
	crit: Crosshair,
	anticrit: Shield,
	heal_left: HandHeart,
	heal_right: HandHeart,
	heal_random: HandHeart,
	heal_lowest: HandHeart,
	heal_adjacent: HandHeart,
	heal_all: HandHeart,
	atk_adjacent: Swords,
};

interface Props {
	role: CombatRole;
	size?: number;
}

export function RoleIcon({ role, size = 14 }: Props) {
	const Icon = ROLE_ICON[role];
	return <Icon size={size} />;
}
