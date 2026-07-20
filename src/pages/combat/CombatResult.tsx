import { Link } from "react-router";
import { resultLabelFr } from "../../i18n/combat.fr";
import type { TeamKey } from "../../types/combat";

interface Props {
	result: TeamKey | "draw";
	myTeamKey: TeamKey;
}

export function CombatResult({ result, myTeamKey }: Props) {
	const label = resultLabelFr(result, myTeamKey);
	return (
		<div className="combat-result" data-outcome={label}>
			<h1>{label}</h1>
			<Link to="/" className="combat-result__back">
				RETOUR
			</Link>
		</div>
	);
}
