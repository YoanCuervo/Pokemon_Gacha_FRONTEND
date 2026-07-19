// =====================================================================
// pages/combat/CombatPage.tsx — La page COMBAT (rendu statique v1).
// Fetch POST /api/combat → CombatLog, puis useCombatPlayer pilote tout.
// --tempo est exposé en variable CSS : les durées d'animation du
// chantier suivant se caleront dessus sans JS supplémentaire.
// =====================================================================

import { useEffect, useState } from "react";
import { useCombatPlayer } from "../../hooks/useCombatPlayer";
import { runCombat } from "../../services/combat.service";
import type { CombatLog, TeamKey } from "../../types/combat";
import { Battlefield } from "./Battlefield";
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

	if (!player.setup)
		return <p className="combat-page__error">Log invalide (setup absent).</p>;

	return (
		<div
			className="combat-page"
			style={{ ["--tempo" as string]: `${player.tempoMs}ms` }}
		>
			<Battlefield
				teams={player.setup.teams}
				cards={player.cards}
				myTeamKey={MY_TEAM_KEY}
			/>
			<CombatControls
				speed={player.speed}
				setSpeed={player.setSpeed}
				skip={player.skip}
				finished={player.finished}
			/>
			{player.finished && player.result && (
				<CombatResult result={player.result} myTeamKey={MY_TEAM_KEY} />
			)}
		</div>
	);
}
