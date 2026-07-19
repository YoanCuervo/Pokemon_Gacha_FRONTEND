// =====================================================================
// pages/combat/CombatCard.tsx — Une carte de combat.
// Visuel + fond type (image à venir, couleur en fallback) + losange
// rôle en icône (libellé FR en tooltip) + pastilles ATTAQUE/VIE en
// bordure basse. data-status pilote le CSS ; "dead" n'est pas rendue.
// =====================================================================

import type { CardState } from "../../hooks/useCombatPlayer";
import { ROLE_FR } from "../../i18n/combat.fr";
import type { MemberSetup } from "../../types/combat";
import { animatedSpriteUrl } from "../../utils/sprites";
import { RoleIcon } from "./RoleIcon";

interface Props {
	member: MemberSetup;
	card: CardState;
}

export function CombatCard({ member, card }: Props) {
	return (
		<div
			className="combat-card"
			data-status={card.status}
			data-type={member.type_primary}
			data-uid={member.uid}
		>
			<span className="combat-card__role" title={ROLE_FR[member.role]}>
				<RoleIcon role={member.role} />
			</span>
			<img
				className="combat-card__sprite"
				src={animatedSpriteUrl(member.pokemon_id, member.is_shiny)}
				alt=""
			/>
			<span className="combat-card__attaque">{member.attaque}</span>
			<span className="combat-card__vie">{card.vie}</span>
		</div>
	);
}
