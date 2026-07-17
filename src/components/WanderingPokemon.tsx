import { useEffect, useRef, useState } from "react";
import { animatedSpriteUrl } from "../utils/sprites";
import "./WanderingPokermon.css";

const MEW_ID = 151;
const SPEED = 60; // px / seconde
const SPRITE_SIZE = 96; // largeur/hauteur approx du sprite, pour le rebond sur les bords
const TURN_INTERVAL_MIN = 1200; // ms avant un changement de cap "franc"
const TURN_INTERVAL_MAX = 3000;
const DRIFT_PER_FRAME = 0.15; // radians max ajoutés à l'angle par frame (trajectoire courbe)

function randomAngle() {
	return Math.random() * Math.PI * 2;
}

function randomTurnDelay() {
	return (
		TURN_INTERVAL_MIN + Math.random() * (TURN_INTERVAL_MAX - TURN_INTERVAL_MIN)
	);
}

function WanderingPokemon() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [facingLeft, setFacingLeft] = useState(false);

	// Toutes les valeurs qui changent à chaque frame vivent en ref : on ne veut
	// PAS re-render 60x/seconde, seul le style DOM est modifié directement.
	const posRef = useRef({ x: 0, y: 0 });
	const angleRef = useRef(randomAngle());
	const isPausedRef = useRef(false);
	const nextTurnAtRef = useRef(0);

	useEffect(() => {
		isPausedRef.current = isPaused;
	}, [isPaused]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		// Position de départ : centre de l'écran
		posRef.current = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		};
		nextTurnAtRef.current = performance.now() + randomTurnDelay();

		let animationFrameId: number;
		let lastTime = performance.now();

		const step = (now: number) => {
			const deltaSeconds = (now - lastTime) / 1000;
			lastTime = now;

			if (!isPausedRef.current) {
				// Changement de cap "franc" de temps en temps, sinon dérive légère
				// de l'angle courant -> trajectoire non-linéaire mais fluide.
				if (now >= nextTurnAtRef.current) {
					angleRef.current += (Math.random() - 0.5) * Math.PI;
					nextTurnAtRef.current = now + randomTurnDelay();
				} else {
					angleRef.current += (Math.random() - 0.5) * DRIFT_PER_FRAME;
				}

				const maxX = window.innerWidth - SPRITE_SIZE;
				const maxY = window.innerHeight - SPRITE_SIZE;

				let nextX =
					posRef.current.x + Math.cos(angleRef.current) * SPEED * deltaSeconds;
				let nextY =
					posRef.current.y + Math.sin(angleRef.current) * SPEED * deltaSeconds;

				// Rebond sur les bords : on inverse la composante concernée et on
				// clamp pour ne jamais sortir du viewport.
				if (nextX < 0) {
					nextX = 0;
					angleRef.current = Math.PI - angleRef.current;
				} else if (nextX > maxX) {
					nextX = maxX;
					angleRef.current = Math.PI - angleRef.current;
				}

				if (nextY < 0) {
					nextY = 0;
					angleRef.current = -angleRef.current;
				} else if (nextY > maxY) {
					nextY = maxY;
					angleRef.current = -angleRef.current;
				}

				posRef.current = { x: nextX, y: nextY };

				el.style.transform = `translate(${nextX}px, ${nextY}px)`;

				// Sens du sprite = signe de la composante horizontale du déplacement
				const movingLeft = Math.cos(angleRef.current) < 0;
				setFacingLeft((prev) => (prev !== movingLeft ? movingLeft : prev));
			}

			animationFrameId = requestAnimationFrame(step);
		};

		animationFrameId = requestAnimationFrame(step);

		return () => cancelAnimationFrame(animationFrameId);
	}, []);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: décor animé, pas un contrôle a11y
		<div
			ref={containerRef}
			className="wandering-pokemon"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<img
				src={animatedSpriteUrl(MEW_ID, false)}
				alt="Mew"
				className="wandering-pokemon-sprite"
				style={{ transform: facingLeft ? "scaleX(-1)" : "scaleX(1)" }}
				draggable={false}
			/>
		</div>
	);
}

export default WanderingPokemon;
