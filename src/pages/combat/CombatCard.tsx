// =====================================================================
// pages/combat/CombatCard.tsx — Une carte de combat (rendu statique v1)
// Visuel + fond type + losange rôle + pastilles ATTAQUE (statique) /
// VIE (vivante). Le statut (alive/dying/dead) pilote le CSS via
// data-status ; la carte "dead" n'est PAS rendue (retrait + resserrement
// flexbox gérés par Battlefield).
// =====================================================================

import type { CardState } from "../../hooks/useCombatPlayer";
import { ROLE_FR } from "../../i18n/combat.fr";
import type { MemberSetup } from "../../types/combat";

/** Sprites en cours d'intégration : centralisé ici, un seul endroit à
 *  changer quand le dossier /sprites sera prêt. */
function spriteUrl(pokemonId: number, isShiny: boolean): string {
	return `/sprites/${isShiny ? "shiny/" : ""}${pokemonId}.png`;
}

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
			<span className="combat-card__role">{ROLE_FR[member.role]}</span>
			<img
				className="combat-card__sprite"
				src={spriteUrl(member.pokemon_id, member.is_shiny)}
				alt=""
			/>
			<div className="combat-card__stats">
				<span className="combat-card__attaque">{member.attaque}</span>
				<span className="combat-card__vie">{card.vie}</span>
			</div>
		</div>
	);
}
