import { useEffect, useRef, useState } from "react";

interface XpBarProps {
	level: number;
	/** Progression dans le palier courant. */
	xpIntoLevel: number;
	/** Taille du palier courant (0 au niveau max). */
	xpForNextLevel: number;
	isMaxLevel: boolean;
}

/** Duree d'un remplissage complet lors d'une montee de niveau (ms). */
const FILL_MS = 420;

/** Barre de progression XP, sous la card.
 *
 *  Animation des montees de niveau : le back renvoie l'etat FINAL (on
 *  peut sauter 10 niveaux d'un coup avec assez de bonbons), pas le
 *  chemin parcouru. On le reconstitue : N remplissages complets 0->100%
 *  puis un dernier partiel jusqu'a la progression reelle. Les paliers
 *  intermediaires n'ont pas leur duree exacte — invisible a l'oeil, et
 *  ca evite d'alourdir le contrat back pour un effet purement visuel.
 */
export function XpBar({
	level,
	xpIntoLevel,
	xpForNextLevel,
	isMaxLevel,
}: XpBarProps) {
	// Le pourcentage AFFICHE (anime), distinct du pourcentage reel.
	const [percent, setPercent] = useState(0);
	// Le niveau AFFICHE : il monte au fil de l'animation, pas d'un coup.
	const [shownLevel, setShownLevel] = useState(level);
	// Desactive la transition CSS le temps de remettre la barre a zero.
	const [instant, setInstant] = useState(false);

	const prevLevel = useRef(level);
	const timers = useRef<number[]>([]);

	const target = isMaxLevel
		? 100
		: xpForNextLevel > 0
			? Math.min(100, (xpIntoLevel / xpForNextLevel) * 100)
			: 0;

	useEffect(() => {
		// Nettoie les timers d'une animation precedente encore en cours.
		for (const t of timers.current) window.clearTimeout(t);
		timers.current = [];

		const gained = level - prevLevel.current;

		// Pas de montee : la barre glisse simplement vers sa valeur.
		if (gained <= 0) {
			setShownLevel(level);
			setInstant(false);
			setPercent(target);
			prevLevel.current = level;
			return;
		}

		// Montee : on rejoue `gained` remplissages complets, puis le
		// partiel final.
		let elapsed = 0;
		for (let i = 0; i < gained; i++) {
			// Remplir jusqu'a 100%
			timers.current.push(
				window.setTimeout(() => {
					setInstant(false);
					setPercent(100);
				}, elapsed),
			);
			elapsed += FILL_MS;

			// Puis remise a zero SANS transition + niveau +1
			timers.current.push(
				window.setTimeout(() => {
					setInstant(true);
					setPercent(0);
					setShownLevel((l) => l + 1);
				}, elapsed),
			);
			elapsed += 40;
		}

		// Dernier remplissage : la progression reelle du nouveau palier.
		timers.current.push(
			window.setTimeout(() => {
				setInstant(false);
				setPercent(target);
			}, elapsed),
		);

		prevLevel.current = level;

		return () => {
			for (const t of timers.current) window.clearTimeout(t);
			timers.current = [];
		};
	}, [level, target]);

	return (
		<div className="xp-bar">
			<div className="xp-bar__header">
				<span className="xp-bar__level">Niveau {shownLevel}</span>
				{!isMaxLevel && (
					<span className="xp-bar__value">
						{xpIntoLevel.toLocaleString("fr-FR")} /{" "}
						{xpForNextLevel.toLocaleString("fr-FR")}
					</span>
				)}
			</div>
			<div className="xp-bar__track">
				<div
					className={
						instant ? "xp-bar__fill xp-bar__fill--instant" : "xp-bar__fill"
					}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
}
