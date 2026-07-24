import { Link } from "react-router";
import { resultLabelFr } from "../../i18n/combat.fr";
import type { TeamKey } from "../../types/combat";

interface Props {
	result: TeamKey | "draw";
	myTeamKey: TeamKey;
	onReplay: (() => void) | null;
	replaying: boolean;
}

export function CombatResult({
	result,
	myTeamKey,
	onReplay,
	replaying,
}: Props) {
	const label = resultLabelFr(result, myTeamKey);
	return (
		<div className="combat-result" data-outcome={label}>
			<h1>{label}</h1>
			<div className="combat-result__actions">
				{onReplay && (
					<button
						type="button"
						className="combat-result__back"
						disabled={replaying}
						onClick={onReplay}
					>
						{replaying ? "…" : "REJOUER"}
					</button>
				)}
				<Link to="/" className="combat-result__back">
					RETOUR
				</Link>
			</div>
		</div>
	);
}
