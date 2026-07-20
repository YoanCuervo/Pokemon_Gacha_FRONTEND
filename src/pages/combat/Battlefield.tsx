// =====================================================================
// pages/combat/Battlefield.tsx — Le terrain : deux rangées.
// Adversaire en haut, joueur en bas (contrat wireframe COMBAT).
// Les cartes "dead" ne sont plus rendues : flexbox resserre les
// survivantes (transition CSS) — la règle d'adjacence rendue visible.
// Les "dying" restent rendues (grisées) un battement.
// Chaque rangée porte le PlayerBanner de son camp (ancré à la rangée).
// =====================================================================

import type { CardState } from "../../hooks/useCombatPlayer";
import type {
	CombatUid,
	TeamKey,
	TeamProfile,
	TeamSetup,
} from "../../types/combat";
import { type CardAction, CombatCard } from "./CombatCard";
import { PlayerBanner } from "./PlayerBanner";

interface RowProps {
	team: TeamSetup;
	profile: TeamProfile;
	cards: Record<CombatUid, CardState>;
	onHover: (uid: string | null) => void;
	side: "top" | "bottom";
	actions: Record<CombatUid, CardAction>;
	actionSeq: number;
	targetUid: string | null;
}

function TeamRow({
	team,
	profile,
	cards,
	onHover,
	side,
	actions,
	actionSeq,
	targetUid,
}: RowProps) {
	return (
		<div className="battlefield__row" data-side={side}>
			<PlayerBanner profile={profile} team={team} side={side} />
			{team.members.map((m) => {
				const card = cards[m.uid];
				if (!card || card.status === "dead") return null;
				return (
					<CombatCard
						key={m.uid}
						member={m}
						card={card}
						onHover={onHover}
						action={actions[m.uid] ?? null}
						actionSeq={actionSeq}
						targetUid={targetUid}
					/>
				);
			})}
		</div>
	);
}

interface Props {
	teams: { a: TeamSetup; b: TeamSetup };
	profiles: { a: TeamProfile; b: TeamProfile };
	cards: Record<CombatUid, CardState>;
	/** L'équipe du joueur : rendue en BAS. */
	myTeamKey: TeamKey;
	onHover: (uid: string | null) => void;
	actions: Record<CombatUid, CardAction>;
	actionSeq: number;
	targetUid: string | null;
}

export function Battlefield({
	teams,
	profiles,
	cards,
	myTeamKey,
	onHover,
	actions,
	actionSeq,
	targetUid,
}: Props) {
	const opponentKey: TeamKey = myTeamKey === "a" ? "b" : "a";
	return (
		<div className="battlefield">
			<TeamRow
				team={teams[opponentKey]}
				profile={profiles[opponentKey]}
				cards={cards}
				onHover={onHover}
				side="top"
				actions={actions}
				actionSeq={actionSeq}
				targetUid={targetUid}
			/>
			<TeamRow
				team={teams[myTeamKey]}
				profile={profiles[myTeamKey]}
				cards={cards}
				onHover={onHover}
				side="bottom"
				actions={actions}
				actionSeq={actionSeq}
				targetUid={targetUid}
			/>
		</div>
	);
}
