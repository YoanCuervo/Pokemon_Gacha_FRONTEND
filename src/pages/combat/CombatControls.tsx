// =====================================================================
// pages/combat/CombatControls.tsx — pause / vitesse ×2 / passer.
// Pause : suspend le métronome du lecteur (le battement en cours va au
// bout, le suivant ne part pas). ×2 accélère le pas de lecture, passer
// saute à l'état final.
// =====================================================================

import { Pause, Play } from "lucide-react";
import type { PlayerSpeed } from "../../hooks/useCombatPlayer";

interface Props {
	speed: PlayerSpeed;
	setSpeed: (s: PlayerSpeed) => void;
	paused: boolean;
	togglePause: () => void;
	skip: () => void;
	finished: boolean;
}

export function CombatControls({
	speed,
	setSpeed,
	paused,
	togglePause,
	skip,
	finished,
}: Props) {
	return (
		<div className="combat-controls">
			<button
				type="button"
				className="combat-controls__pause"
				aria-pressed={paused}
				onClick={togglePause}
				disabled={finished}
			>
				{paused ? <Play size={16} /> : <Pause size={16} />}
			</button>
			<button
				type="button"
				className="combat-controls__speed"
				aria-pressed={speed === 2}
				onClick={() => setSpeed(speed === 2 ? 1 : 2)}
				disabled={finished}
			>
				×2
			</button>
			<button
				type="button"
				className="combat-controls__skip"
				onClick={skip}
				disabled={finished}
			>
				Passer
			</button>
		</div>
	);
}
