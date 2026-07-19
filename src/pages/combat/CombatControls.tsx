// =====================================================================
// pages/combat/CombatControls.tsx — vitesse ×2 / passer.
// Standard du genre : ×2 accélère le pas de lecture, passer saute
// directement à l'état final (hook skip()).
// =====================================================================

import type { PlayerSpeed } from "../../hooks/useCombatPlayer";

interface Props {
	speed: PlayerSpeed;
	setSpeed: (s: PlayerSpeed) => void;
	skip: () => void;
	finished: boolean;
}

export function CombatControls({ speed, setSpeed, skip, finished }: Props) {
	return (
		<div className="combat-controls">
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
