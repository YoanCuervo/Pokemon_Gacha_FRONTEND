// =====================================================================
// pages/combat/CombatPage.tsx — La page COMBAT (rendu statique v1).
// Fetch POST /api/combat → CombatLog, puis useCombatPlayer pilote tout.
// --tempo est exposé en variable CSS : les durées d'animation du
// chantier suivant se caleront dessus sans JS supplémentaire.
// =====================================================================

import { useEffect, useMemo, useState } from "react";
import { useCombatPlayer } from "../../hooks/useCombatPlayer";
import { runCombat } from "../../services/combat.service";
import type { CombatLog, CombatUid, TeamKey } from "../../types/combat";
import { ARENA_IMAGE } from "../../utils/arenas";
import { Battlefield } from "./Battlefield";
import { CardPreview } from "./CardPreview";
import type { CardAction } from "./CombatCard";
import { CombatControls } from "./CombatControls";
import { CombatResult } from "./CombatResult";
import "./combat.css";

/** Dette auth (JWT à venir) : en V1 miroir, le joueur est l'équipe "a".
 *  Quand l'auth existera, myTeamKey sera dérivé de setup.teams.X.user_id
 *  vs l'utilisateur connecté. Un seul endroit à changer. */
const MY_TEAM_KEY: TeamKey = "a";

type LoadState =
	| { status: "loading" }
	| { status: "error"; message: string }
	| { status: "ready"; log: CombatLog };

export function CombatPage() {
	const [load, setLoad] = useState<LoadState>({ status: "loading" });

	useEffect(() => {
		let cancelled = false;
		runCombat()
			.then((log) => {
				if (!cancelled) setLoad({ status: "ready", log });
			})
			.catch((e: unknown) => {
				if (!cancelled)
					setLoad({
						status: "error",
						message: e instanceof Error ? e.message : "Erreur inconnue",
					});
			});
		return () => {
			cancelled = true;
		};
	}, []);

	if (load.status === "loading")
		return <p className="combat-page__loading">Combat en préparation…</p>;
	if (load.status === "error")
		return <p className="combat-page__error">Erreur : {load.message}</p>;
	return <CombatScreen log={load.log} />;
}

/** Séparé : useCombatPlayer exige un log — on ne monte l'écran qu'une
 *  fois le fetch terminé (pas de hook conditionnel). */
function CombatScreen({ log }: { log: CombatLog }) {
	const player = useCombatPlayer(log);
	const [hoveredUid, setHoveredUid] = useState<string | null>(null);

	// L'événement courant → l'action de chaque carte pour ce battement.
	// Le type d'événement choisit l'animation (cadrage validé) :
	// attack : acteur = attacking, hits = hit (hit-crit si ev.crit —
	// un seul jet, tous les hits x1.5, §5.1) ; la riposte n'a pas
	// d'animation propre : elle est contenue dans l'échange.
	// heal : acteur = healing, cibles = healed.
	const actions = useMemo<Record<CombatUid, CardAction>>(() => {
		const ev = player.currentEvent;
		const map: Record<CombatUid, CardAction> = {};
		if (!ev) return map;
		if (ev.type === "attack") {
			map[ev.actor] = "attacking";
			for (const h of ev.hits) map[h.uid] = ev.crit ? "hit-crit" : "hit";
		} else if (ev.type === "heal") {
			map[ev.actor] = "healing";
			for (const t of ev.targets) {
				// heal_random/lowest peuvent cibler le soigneur lui-même (§5.1) :
				// l'animation d'acteur prime.
				if (map[t.uid] !== "healing") map[t.uid] = "healed";
			}
		}
		return map;
	}, [player.currentEvent]);

	const actionSeq =
		player.currentEvent && "seq" in player.currentEvent
			? player.currentEvent.seq
			: -1;

	// La cible de la charge (attack uniquement) : consommee par la carte
	// qui porte action="attacking" pour diriger son mouvement.
	const targetUid =
		player.currentEvent?.type === "attack" ? player.currentEvent.target : null;

	// Fiche figée : on retrouve le MemberSetup du uid survolé.
	const hoveredMember = useMemo(() => {
		if (!hoveredUid || !player.setup) return null;
		const { a, b } = player.setup.teams;
		return (
			[...a.members, ...b.members].find((m) => m.uid === hoveredUid) ?? null
		);
	}, [hoveredUid, player.setup]);

	if (!player.setup)
		return <p className="combat-page__error">Log invalide (setup absent).</p>;

	return (
		<div
			className="combat-page"
			style={{
				["--tempo" as string]: `${player.tempoMs}ms`,
				["--arena-image" as string]: player.setup
					? `url(${ARENA_IMAGE[player.setup.arena]})`
					: "none",
			}}
		>
			<Battlefield
				teams={player.setup.teams}
				profiles={player.setup.profiles}
				cards={player.cards}
				myTeamKey={MY_TEAM_KEY}
				onHover={setHoveredUid}
				actions={actions}
				actionSeq={actionSeq}
				targetUid={targetUid}
			/>
			{hoveredMember && <CardPreview member={hoveredMember} />}
			<CombatControls
				speed={player.speed}
				setSpeed={player.setSpeed}
				paused={player.paused}
				togglePause={player.togglePause}
				skip={player.skip}
				finished={player.finished}
			/>
			{player.finished && player.result && (
				<CombatResult result={player.result} myTeamKey={MY_TEAM_KEY} />
			)}
		</div>
	);
}
