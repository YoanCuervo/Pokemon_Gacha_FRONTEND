// =====================================================================
// pages/combat/CombatCard.tsx — Une carte de combat.
// Visuel + fond type (image à venir, couleur en fallback) + losange
// rôle en icône (libellé FR en tooltip) + pastilles ATTAQUE/VIE en
// bordure basse. data-status pilote le CSS ; "dead" n'est pas rendue.
// ANIMATIONS : le wrapper .combat-card-slot reste stable dans le flux
// flex ; la carte intérieure porte data-action + key={seq}. Changer la
// key remonte la carte → l'animation CSS redémarre même si le même
// pokémon agit deux battements de suite (sinon le navigateur ne
// rejoue pas une animation dont la classe n'a pas changé).
// =====================================================================

import { useLayoutEffect, useRef } from "react";
import type { CardState } from "../../hooks/useCombatPlayer";
import { ROLE_FR } from "../../i18n/combat.fr";
import type { MemberSetup } from "../../types/combat";
import { animatedSpriteUrl } from "../../utils/sprites";
import { RoleIcon } from "./RoleIcon";

/** L'action du battement courant pour CETTE carte (null = spectatrice).
 *  Dérivée de currentEvent par CombatPage. */
export type CardAction =
	| "attacking"
	| "hit"
	| "hit-crit"
	| "healing"
	| "healed";

interface Props {
	member: MemberSetup;
	card: CardState;
	onHover: (uid: string | null) => void;
	action: CardAction | null;
	/** seq de l'événement courant : sert de key pour relancer l'animation. */
	actionSeq: number;
	/** uid de la cible principale quand CETTE carte attaque (ev.target). */
	targetUid: string | null;
}

export function CombatCard({
	member,
	card,
	onHover,
	action,
	actionSeq,
	targetUid,
}: Props) {
	const cardRef = useRef<HTMLDivElement>(null);

	// Charge dirigee : le CSS ne connait pas la position de la cible.
	// On mesure les deux cartes et on passe le vecteur en variables CSS
	// (--dx/--dy) que la keyframe "charge" consomme. Facteur 0.8 : on
	// s'arrete en chevauchant la cible, pas en la recouvrant.
	useLayoutEffect(() => {
		const el = cardRef.current;
		if (!el || action !== "attacking" || !targetUid) return;
		const target = document.querySelector(
			`.combat-card[data-uid="${CSS.escape(targetUid)}"]`,
		);
		if (!target) return;
		const a = el.getBoundingClientRect();
		const b = target.getBoundingClientRect();
		const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) * 0.8;
		const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) * 0.8;
		el.style.setProperty("--dx", `${dx.toFixed(1)}px`);
		el.style.setProperty("--dy", `${dy.toFixed(1)}px`);
	}, [action, targetUid]);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover informatif, aucune action
		<div
			className="combat-card-slot"
			onMouseEnter={() => onHover(member.uid)}
			onMouseLeave={() => onHover(null)}
		>
			<div
				ref={cardRef}
				key={action ? actionSeq : "idle"}
				className="combat-card"
				data-status={card.status}
				data-type={member.type_primary}
				data-uid={member.uid}
				data-action={action ?? undefined}
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
		</div>
	);
}
