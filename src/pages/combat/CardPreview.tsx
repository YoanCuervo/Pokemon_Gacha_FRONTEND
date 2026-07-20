// =====================================================================
// pages/combat/CardPreview.tsx — Panneau de survol (ancré à droite).
// Fiche d'identité FIGÉE du combattant : tout vient de MemberSetup
// (stats d'avant combat), rien de vivant — le panneau ne bouge pas
// pendant le combat. Slots d'items : 4 positions fixes att/def/
// speed/spe, remplies depuis member.items (fond = rareté), détail
// nom FR · effet listé dessous (pas de tooltip : le panneau est
// lui-même un hover, pointer-events none).
// =====================================================================

import { ROLE_FR } from "../../i18n/combat.fr";
import { itemEffectFr, itemNameFr } from "../../i18n/items.fr";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { MemberSetup, SetupItem } from "../../types/combat";
import { artworkUrl } from "../../utils/sprites";
import { RoleIcon } from "./RoleIcon";

interface Props {
	member: MemberSetup;
}

/** L'ordre d'affichage des slots — la géographie fixe de l'équipement. */
const SLOT_CATEGORIES: SetupItem["category"][] = ["att", "def", "speed", "spe"];

const CATEGORY_LABEL: Record<SetupItem["category"], string> = {
	att: "ATT",
	def: "DEF",
	speed: "VIT",
	spe: "SPE",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function CardPreview({ member }: Props) {
	const itemByCategory = (category: SetupItem["category"]) =>
		member.items.find((item) => item.category === category) ?? null;

	return (
		<aside className="card-preview" data-type={member.type_primary}>
			<img
				className="card-preview__sprite"
				src={artworkUrl(member.pokemon_id, member.is_shiny)}
				alt=""
			/>
			<div className="card-preview__stars">
				{Array.from({ length: member.stars }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: étoiles identiques, liste figée
					<span key={i}>★</span>
				))}
			</div>
			<h2 className="card-preview__name">{pokemonNameFr(member.pokemon_id)}</h2>
			<p className="card-preview__role">{ROLE_FR[member.role]}</p>
			<div className="card-preview__items">
				{SLOT_CATEGORIES.map((category) => {
					const item = itemByCategory(category);
					return (
						<span
							key={category}
							className="card-preview__item"
							data-rarity={item?.rarity}
						>
							{item && CATEGORY_LABEL[category]}
						</span>
					);
				})}
			</div>
			{member.items.length > 0 && (
				<ul className="card-preview__item-list">
					{member.items.map((item) => (
						<li key={item.category}>
							{itemNameFr(item.name)} · {itemEffectFr(item)}
						</li>
					))}
				</ul>
			)}
			<p className="card-preview__types">
				{capitalize(member.type_primary)}
				{member.type_secondary && ` / ${capitalize(member.type_secondary)}`}
			</p>
			<div className="card-preview__stats">
				<span className="card-preview__attaque">{member.attaque}</span>
				<span className="card-preview__vie">{member.vie_max}</span>
			</div>
			<span className="card-preview__role-icon">
				<RoleIcon role={member.role} size={18} />
			</span>
		</aside>
	);
}
