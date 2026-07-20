// =====================================================================
// hooks/useCombatPlayer.ts — Lecteur du log de combat (v1, 19/07/2026)
// Toute la logique de relecture vit ici : curseur, tempo, état du
// terrain dérivé du log, battement mourant→mort, vitesse, skip.
// Les composants ne font qu'afficher ce que le hook expose.
// Le front ne calcule RIEN : il applique vie_apres tel quel.
// =====================================================================

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type {
	CombatEvent,
	CombatLog,
	CombatUid,
	SetupEvent,
	TeamKey,
} from "../types/combat";

/** Tempo de base entre deux actions (ms). ×2 → moitié. */
const BASE_TEMPO_MS = 800;

export type CardStatus = "alive" | "dying" | "dead";

/** État visuel d'une carte, dérivé du log consommé. */
export interface CardState {
	vie: number; // jamais < 0 à l'affichage (overkill écrêté ici)
	status: CardStatus;
}

export type PlayerSpeed = 1 | 2;

interface PlayerState {
	cursor: number; // index du DERNIER événement consommé (-1 = rien)
	cards: Record<CombatUid, CardState>;
	speed: PlayerSpeed;
	paused: boolean;
	finished: boolean;
}

type PlayerAction =
	| { kind: "tick" }
	| { kind: "skip" }
	| { kind: "setSpeed"; speed: PlayerSpeed }
	| { kind: "togglePause" };

/** Écrête l'overkill : le log peut porter une vie négative (contrat). */
function clampVie(v: number): number {
	return v < 0 ? 0 : v;
}

/** Applique UN événement aux cartes (mutation d'une copie). */
function applyEvent(
	cards: Record<CombatUid, CardState>,
	ev: CombatEvent,
): void {
	switch (ev.type) {
		case "attack": {
			for (const hit of ev.hits) {
				const c = cards[hit.uid];
				if (c) c.vie = clampVie(hit.vie_apres);
			}
			if (ev.riposte) {
				const c = cards[ev.riposte.uid];
				if (c) c.vie = clampVie(ev.riposte.vie_apres);
			}
			break;
		}
		case "heal": {
			for (const t of ev.targets) {
				const c = cards[t.uid];
				if (c) c.vie = t.vie_apres;
			}
			break;
		}
		case "death": {
			const c = cards[ev.uid];
			if (c) c.status = "dying"; // grisée ce battement, retirée au suivant
			break;
		}
		// setup / coinflip / end : rien à appliquer aux cartes
		case "setup":
		case "coinflip":
		case "end":
			break;
	}
}

/** Copie superficielle des cartes (les CardState sont recréés). */
function cloneCards(
	cards: Record<CombatUid, CardState>,
): Record<CombatUid, CardState> {
	const out: Record<CombatUid, CardState> = {};
	for (const [uid, c] of Object.entries(cards)) {
		out[uid] = { vie: c.vie, status: c.status };
	}
	return out;
}

/** Les "dying" du battement précédent deviennent "dead". */
function settleDying(cards: Record<CombatUid, CardState>): void {
	for (const c of Object.values(cards)) {
		if (c.status === "dying") c.status = "dead";
	}
}

export function initState(log: CombatLog): PlayerState {
	// setup est TOUJOURS l'événement 0 (contrat). On le consomme d'emblée :
	// le terrain se dessine immédiatement, la lecture commence à l'action 1.
	const setup = log.events[0];
	const cards: Record<CombatUid, CardState> = {};
	if (setup && setup.type === "setup") {
		for (const key of ["a", "b"] as const) {
			for (const m of setup.teams[key].members) {
				cards[m.uid] = { vie: m.vie_max, status: "alive" };
			}
		}
	}
	return { cursor: 0, cards, speed: 1, paused: false, finished: false };
}

// NOTE : le reducer a besoin du log mais on ne le met pas dans l'état
// (pas de duplication). On le fabrique donc par fermeture sur le log.
// Exporté (avec initState) pour les tests à sec sans React.
export function makeReducer(log: CombatLog) {
	return function reduce(
		state: PlayerState,
		action: PlayerAction,
	): PlayerState {
		switch (action.kind) {
			case "setSpeed":
				return { ...state, speed: action.speed };
			case "togglePause":
				return { ...state, paused: !state.paused };
			case "tick": {
				if (state.finished) return state;
				const cards = cloneCards(state.cards);
				settleDying(cards);
				const next = state.cursor + 1;
				const ev = log.events[next];
				if (!ev) return { ...state, cards, finished: true }; // ceinture
				applyEvent(cards, ev);
				return {
					...state,
					cards,
					cursor: next,
					finished: ev.type === "end",
				};
			}
			case "skip": {
				if (state.finished) return state;
				const cards = cloneCards(state.cards);
				// Consomme tout le reste d'un coup, sans timer.
				for (let i = state.cursor + 1; i < log.events.length; i++) {
					const ev = log.events[i];
					if (ev) applyEvent(cards, ev);
				}
				settleDying(cards); // les dying créés par le rattrapage aussi
				return {
					...state,
					cards,
					cursor: log.events.length - 1,
					finished: true,
				};
			}
		}
	};
}

export interface CombatPlayer {
	/** Setup (événement 0) : équipes, rôles, attaque, vie_max, first. */
	setup: SetupEvent | null;
	/** État visuel courant par uid (vie écrêtée, alive/dying/dead). */
	cards: Record<CombatUid, CardState>;
	/** Événement courant (choisit l'animation). null avant la 1re action. */
	currentEvent: CombatEvent | null;
	speed: PlayerSpeed;
	setSpeed: (s: PlayerSpeed) => void;
	paused: boolean;
	togglePause: () => void;
	skip: () => void;
	finished: boolean;
	/** Résultat, disponible seulement quand finished. */
	result: TeamKey | "draw" | null;
	/** Tempo courant en ms — à passer au CSS (variable --tempo). */
	tempoMs: number;
}

export function useCombatPlayer(log: CombatLog): CombatPlayer {
	const reduce = useMemo(() => makeReducer(log), [log]);
	const [state, dispatch] = useReducer(reduce, log, initState);

	const tempoMs = BASE_TEMPO_MS / state.speed;

	// Le métronome : un timeout par battement (pas un interval : le tempo
	// peut changer entre deux battements via ×2).
	// state.cursor n'est pas lu dans l'effet mais il est le MÉTRONOME :
	// chaque battement consommé réarme le timeout du suivant.
	// biome-ignore lint/correctness/useExhaustiveDependencies: cursor réarme volontairement l'effet
	useEffect(() => {
		if (state.finished || state.paused) return;
		const t = setTimeout(() => dispatch({ kind: "tick" }), tempoMs);
		return () => clearTimeout(t);
	}, [state.finished, state.paused, state.cursor, tempoMs]);

	const setup = useMemo<SetupEvent | null>(() => {
		const ev = log.events[0];
		return ev && ev.type === "setup" ? ev : null;
	}, [log]);

	const currentEvent =
		state.cursor >= 1 ? (log.events[state.cursor] ?? null) : null;

	const result = useMemo<TeamKey | "draw" | null>(() => {
		if (!state.finished) return null;
		const last = log.events[log.events.length - 1];
		return last && last.type === "end" ? last.result : null;
	}, [state.finished, log]);

	const setSpeed = useCallback(
		(s: PlayerSpeed) => dispatch({ kind: "setSpeed", speed: s }),
		[],
	);
	const skip = useCallback(() => dispatch({ kind: "skip" }), []);
	const togglePause = useCallback(() => dispatch({ kind: "togglePause" }), []);

	return {
		setup,
		cards: state.cards,
		currentEvent,
		speed: state.speed,
		setSpeed,
		paused: state.paused,
		togglePause,
		skip,
		finished: state.finished,
		result,
		tempoMs,
	};
}
