// =====================================================================
// pages/sandbox/SandboxCard.tsx — La carte d'un slot de composition.
//
// Reprend le design de CardPreview (pages/combat) : c'est le meilleur
// rendu du projet, et il montre EXACTEMENT ce que le combat verra.
// Differences assumees :
//   - elle vit DANS le flux (grille de 6), pas en panneau flottant ;
//   - les types sont des pastilles TypeBadge (langage de l'inventaire) ;
//   - le detail des items est un TOOLTIP au hover (ItemTooltip,
//     partage avec l'inventaire) — une liste texte ne tenait pas
//     dans la carte. SetupItem ne porte ni required_type ni mode :
//     le tooltip s'en passe (champs facultatifs), dette si besoin.
// Les donnees viennent du back (MemberSetup) : le front ne reconstitue
// rien depuis son draft, ce qui garantit que l'affichage colle au
// calcul du moteur.
// =====================================================================

import { useState } from "react";
import { createPortal } from "react-dom";
import { TypeBadge } from "../../components/TypeBadge";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { MemberSetup, SetupItem } from "../../types/combat";
import { artworkUrl, itemSpriteUrl } from "../../utils/sprites";
import { RoleIcon } from "../combat/RoleIcon";
import { ItemTooltip } from "../inventory/ItemTooltip";

/** L'ordre d'affichage des slots — la geographie fixe de l'equipement. */
const SLOT_CATEGORIES: SetupItem["category"][] = ["att", "def", "speed", "spe"];

const CATEGORY_LABEL: Record<SetupItem["category"], string> = {
	att: "ATT",
	def: "DEF",
	speed: "VIT",
	spe: "SPE",
};

const MAX_STARS = 5;

/** Le tooltip suit la souris : item survole + position du curseur. */
interface HoverState {
	item: SetupItem;
	x: number;
	y: number;
}

interface SandboxCardProps {
	/** Le membre tel que le moteur le voit (null si la preview n'a pas
	 *  encore repondu : on affiche alors une carte en attente). */
	setup: MemberSetup;
	selected: boolean;
	onClick: () => void;
}

export function SandboxCard({ setup, selected, onClick }: SandboxCardProps) {
	const [hover, setHover] = useState<HoverState | null>(null);

	const itemByCategory = (category: SetupItem["category"]) =>
		setup.items.find((item) => item.category === category) ?? null;

	return (
		<button
			type="button"
			className={`sandbox-card${selected ? " sandbox-card--selected" : ""}`}
			data-type={setup.type_primary}
			onClick={onClick}
			onMouseLeave={() => setHover(null)}
		>
			{/* Pastilles de type en haut a gauche — meme langage que
			    la carte d'inventaire (TypeBadge). */}
			<span className="sandbox-card__types">
				<TypeBadge type={setup.type_primary} />
				{setup.type_secondary && <TypeBadge type={setup.type_secondary} />}
			</span>

			{/* Bandeau d'etoiles, pointe en bas — meme DA que le combat */}
			<span className="sandbox-card__stars">
				{Array.from({ length: MAX_STARS }, (_, i) => (
					<span
						key={i}
						className={
							i < setup.stars
								? "sandbox-card__star"
								: "sandbox-card__star sandbox-card__star--empty"
						}
					>
						★
					</span>
				))}
			</span>

			<img
				className="sandbox-card__sprite"
				src={artworkUrl(setup.pokemon_id, setup.is_shiny)}
				alt=""
			/>

			<span className="sandbox-card__name">
				{pokemonNameFr(setup.pokemon_id)}
				{setup.is_shiny && <span className="inventory__shiny">S</span>}
			</span>

			{/* Les 4 slots d'items : toujours les 4, vides en pointille.
			    Item present -> sprite, fond rarete, TOOLTIP au hover. */}
			<span className="sandbox-card__items">
				{SLOT_CATEGORIES.map((category) => {
					const item = itemByCategory(category);
					// Zone de hover purement informative DANS le bouton
					// carte : pas d'element interactif imbrique possible
					// (button dans button interdit), le span est legitime.
					return (
						<span
							key={category}
							className="sandbox-card__item"
							data-rarity={item?.rarity}
							title={item ? undefined : CATEGORY_LABEL[category]}
							onMouseMove={
								item
									? (e) => setHover({ item, x: e.clientX, y: e.clientY })
									: undefined
							}
							onMouseLeave={item ? () => setHover(null) : undefined}
						>
							{item && (
								<img
									className="sandbox-card__item-icon"
									src={itemSpriteUrl(item.name)}
									alt=""
								/>
							)}
						</span>
					);
				})}
			</span>

			{hover &&
				createPortal(
					<ItemTooltip
						name={hover.item.name}
						category={hover.item.category}
						rarity={hover.item.rarity}
						boost_value={hover.item.boost}
						required_type={null}
						mode={null}
						x={hover.x}
						y={hover.y}
					/>,
					document.body,
				)}

			{/* Les deux chiffres du combat, en bordure basse (COMBAT_SPEC 11) */}
			<span className="sandbox-card__attaque">{setup.attaque}</span>
			<span className="sandbox-card__vie">{setup.vie_max}</span>

			{/* Le role, au centre bas : c'est LA donnee de theorycrafting */}
			<span className="sandbox-card__role-icon">
				<RoleIcon role={setup.role} size={16} />
			</span>
		</button>
	);
}
