// =====================================================================
// pages/combat/Battlefield.tsx — Le terrain : deux rangées.
// Adversaire en haut, joueur en bas (contrat wireframe COMBAT).
// Les cartes "dead" ne sont plus rendues : flexbox resserre les
// survivantes (transition CSS) — la règle d'adjacence rendue visible.
// Les "dying" restent rendues (grisées) un battement.
// =====================================================================

import type { CardState } from "../../hooks/useCombatPlayer";
import type { CombatUid, TeamKey, TeamSetup } from "../../types/combat";
import { CombatCard } from "./CombatCard";

interface RowProps {
	team: TeamSetup;
	cards: Record<CombatUid, CardState>;
}

function TeamRow({ team, cards }: RowProps) {
	return (
		<div className="battlefield__row">
			{team.members.map((m) => {
				const card = cards[m.uid];
				if (!card || card.status === "dead") return null;
				return <CombatCard key={m.uid} member={m} card={card} />;
			})}
		</div>
	);
}

interface Props {
	teams: { a: TeamSetup; b: TeamSetup };
	cards: Record<CombatUid, CardState>;
	/** L'équipe du joueur : rendue en BAS. */
	myTeamKey: TeamKey;
}

export function Battlefield({ teams, cards, myTeamKey }: Props) {
	const opponentKey: TeamKey = myTeamKey === "a" ? "b" : "a";
	return (
		<div className="battlefield">
			<TeamRow team={teams[opponentKey]} cards={cards} />
			<TeamRow team={teams[myTeamKey]} cards={cards} />
		</div>
	);
}
