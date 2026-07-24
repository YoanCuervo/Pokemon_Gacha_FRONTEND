// =====================================================================
// pages/sandbox/SandboxCard.tsx — La carte d'un slot de composition.
//
// Reprend le design de CardPreview (pages/combat) : c'est le meilleur
// rendu du projet, et il montre EXACTEMENT ce que le combat verra.
// Deux differences assumees :
//   - elle vit DANS le flux (grille de 6), pas en panneau flottant ;
//   - elle est compacte (pas de liste detaillee des items).
// Les donnees viennent du back (MemberSetup) : le front ne reconstitue
// rien depuis son draft, ce qui garantit que l'affichage colle au
// calcul du moteur.
// =====================================================================

import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { MemberSetup, SetupItem } from "../../types/combat";
import { artworkUrl } from "../../utils/sprites";
import { RoleIcon } from "../combat/RoleIcon";

/** L'ordre d'affichage des slots — la geographie fixe de l'equipement. */
const SLOT_CATEGORIES: SetupItem["category"][] = ["att", "def", "speed", "spe"];

const CATEGORY_LABEL: Record<SetupItem["category"], string> = {
	att: "ATT",
	def: "DEF",
	speed: "VIT",
	spe: "SPE",
};

const MAX_STARS = 5;

interface SandboxCardProps {
	/** Le membre tel que le moteur le voit (null si la preview n'a pas
	 *  encore repondu : on affiche alors une carte en attente). */
	setup: MemberSetup;
	selected: boolean;
	onClick: () => void;
}

export function SandboxCard({ setup, selected, onClick }: SandboxCardProps) {
	const itemByCategory = (category: SetupItem["category"]) =>
		setup.items.find((item) => item.category === category) ?? null;

	return (
		<button
			type="button"
			className={`sandbox-card${selected ? " sandbox-card--selected" : ""}`}
			data-type={setup.type_primary}
			onClick={onClick}
		>
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
			    Le fond porte la rarete (meme langage que l'inventaire). */}
			<span className="sandbox-card__items">
				{SLOT_CATEGORIES.map((category) => {
					const item = itemByCategory(category);
					return (
						<span
							key={category}
							className="sandbox-card__item"
							data-rarity={item?.rarity}
							title={item ? item.name : CATEGORY_LABEL[category]}
						>
							{item && CATEGORY_LABEL[category]}
						</span>
					);
				})}
			</span>

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
