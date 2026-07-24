// =====================================================================
// pages/combat/CardPreview.tsx — Panneau de survol (ancré à droite).
// Fiche d'identité FIGÉE du combattant : tout vient de MemberSetup
// (stats d'avant combat), rien de vivant — le panneau ne bouge pas
// pendant le combat. Slots d'items : 4 positions fixes att/def/
// speed/spe, remplies depuis member.items (sprite + fond = rareté),
// détail nom FR · effet listé dessous (pas de tooltip : le panneau
// est lui-même un hover, pointer-events none).
// =====================================================================

import { ROLE_FR } from "../../i18n/combat.fr";
import { itemEffectFr, itemNameFr } from "../../i18n/items.fr";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import { typeNameFr } from "../../i18n/type.fr";
import type { MemberSetup, SetupItem } from "../../types/combat";
import { artworkUrl, itemSpriteUrl } from "../../utils/sprites";
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

export function CardPreview({ member }: Props) {
	const itemByCategory = (category: SetupItem["category"]) =>
		member.items.find((item) => item.category === category) ?? null;

	return (
		<aside className="card-preview" data-type={member.type_primary}>
			{/* Types en haut à gauche, traduits (le "Fire / Flying" anglais
			    était une incohérence : tout le jeu parle FR) */}
			<span className="card-preview__types">
				{typeNameFr(member.type_primary)}
				{member.type_secondary && ` / ${typeNameFr(member.type_secondary)}`}
			</span>
			<img
				className="card-preview__sprite"
				src={artworkUrl(member.pokemon_id, member.is_shiny)}
				alt=""
			/>
			<div className="card-preview__stars">
				{Array.from({ length: member.stars }, (_, i) => (
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
							title={item ? item.name : CATEGORY_LABEL[category]}
						>
							{item && (
								<img
									className="card-preview__item-icon"
									src={itemSpriteUrl(item.name)}
									alt=""
								/>
							)}
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
