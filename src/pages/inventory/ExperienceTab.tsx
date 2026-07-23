import { useEffect, useState } from "react";
import type { XpState } from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";

/** Le nom PokeAPI du bonbon, pour le sprite. Un seul type aujourd'hui. */
const CANDY_NAME = "Rare Candy";

interface ExperienceTabProps {
	xp: XpState;
	/** Quantite choisie au stepper (etat porte par le parent : la modale
	 *  de confirmation MAX en a besoin). */
	amount: number;
	onChangeAmount: (amount: number) => void;
	onUse: () => void;
	pending: boolean;
}

/** Onglet D — bonbons XP.
 *  Un SEUL item dans le tableau : le bonbon est fongible, on ne manipule
 *  qu'une quantite. Pas de plancher de cases vides comme dans les autres
 *  onglets — il n'y a rien d'autre a montrer.
 *  Le stepper vit DANS le tableau (il agit sur son contenu) ; USE reste
 *  dehors, au meme endroit que dans les autres onglets.
 *  Pas de confirmation, SAUF si le geste vide tout le pot (le parent
 *  s'en charge) : rien n'est detruit, mais MAX rend le geste trop facile. */
export function ExperienceTab({
	xp,
	amount,
	onChangeAmount,
	onUse,
	pending,
}: ExperienceTabProps) {
	const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);

	// Le stepper ne peut pas depasser ce que le joueur possede.
	const max = xp.candies_owned;

	// Si le pot diminue (apres un USE), on recadre la quantite choisie.
	useEffect(() => {
		if (amount > max) onChangeAmount(Math.max(1, max));
	}, [amount, max, onChangeAmount]);

	const canUse = !xp.is_max_level && max > 0 && amount > 0 && amount <= max;

	function clamp(next: number) {
		if (max === 0) return 0;
		return Math.min(Math.max(1, next), max);
	}

	return (
		<div className="inventory__tab-content">
			<div className="inventory__grid-wrap">
				<div className="experience__grid">
					{/* biome-ignore lint/a11y/noStaticElementInteractions: survol décoratif (tooltip informatif) — la case n'est pas actionnable, l'action passe par le stepper et USE */}
					<div
						className="candy-cell"
						onMouseEnter={(e) => setHovered({ x: e.clientX, y: e.clientY })}
						onMouseMove={(e) => setHovered({ x: e.clientX, y: e.clientY })}
						onMouseLeave={() => setHovered(null)}
					>
						<img
							src={itemSpriteUrl(CANDY_NAME)}
							alt="Bonbon XP"
							className="candy-cell__icon"
						/>
						<span className="candy-cell__qty">{xp.candies_owned}</span>
					</div>
				</div>

				<div className="experience__stepper">
					<button
						type="button"
						className="experience__stepper-btn"
						onClick={() => onChangeAmount(clamp(amount - 1))}
						disabled={pending || amount <= 1}
					>
						−
					</button>
					<input
						type="number"
						className="experience__stepper-input"
						value={amount}
						min={1}
						max={max}
						onChange={(e) => onChangeAmount(clamp(Number(e.target.value)))}
						disabled={pending || max === 0}
					/>
					<button
						type="button"
						className="experience__stepper-btn"
						onClick={() => onChangeAmount(clamp(amount + 1))}
						disabled={pending || amount >= max}
					>
						+
					</button>
					{/* Raccourci : tout consommer d'un coup */}
					<button
						type="button"
						className="experience__stepper-max"
						onClick={() => onChangeAmount(max)}
						disabled={pending || max === 0 || amount === max}
					>
						MAX
					</button>
				</div>
			</div>

			<div className="inventory__grid-actions">
				<button
					type="button"
					className="inventory__btn"
					disabled={!canUse || pending}
					onClick={onUse}
				>
					{pending ? "…" : "USE"}
				</button>
			</div>

			{hovered && (
				<div
					className="item-tooltip"
					data-rarity="rare"
					style={{ left: hovered.x + 14, top: hovered.y + 14 }}
				>
					<span className="item-tooltip__name">Bonbon XP</span>
					<span className="item-tooltip__cat">Consommable</span>
					<span className="item-tooltip__boost">+{xp.candy_xp_value} XP</span>
					<span className="item-tooltip__line">
						{xp.candies_owned} en réserve
					</span>
				</div>
			)}
		</div>
	);
}
