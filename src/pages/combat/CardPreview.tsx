// =====================================================================
// pages/combat/CardPreview.tsx — Panneau de survol (ancré à droite).
// Fiche d'identité FIGÉE du combattant : tout vient de MemberSetup
// (stats d'avant combat), rien de vivant — le panneau ne bouge pas
// pendant le combat. Emplacement items présent mais vide :
// DETTE — le contrat du log n'expose pas les items équipés
// (extension MemberSetup côté back à faire avec la page équipement).
// =====================================================================

import { ROLE_FR } from "../../i18n/combat.fr";
import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { MemberSetup } from "../../types/combat";
import { artworkUrl } from "../../utils/sprites";
import { RoleIcon } from "./RoleIcon";

interface Props {
	member: MemberSetup;
}

export function CardPreview({ member }: Props) {
	return (
		<aside className="card-preview" data-type={member.type_primary}>
			<img
				className="card-preview__sprite"
				src={artworkUrl(member.pokemon_id, member.is_shiny)}
				alt=""
			/>
			{member.is_shiny && (
				<div className="card-preview__stars">
					<span>★</span>
				</div>
			)}
			<h2 className="card-preview__name">{pokemonNameFr(member.pokemon_id)}</h2>
			<p className="card-preview__role">
				<RoleIcon role={member.role} size={16} />
				{ROLE_FR[member.role]}
			</p>
			<div className="card-preview__items">
				{/* DETTE : items équipés — en attente de l'extension du contrat */}
				<span className="card-preview__item" />
				<span className="card-preview__item" />
				<span className="card-preview__item" />
				<span className="card-preview__item" />
			</div>
			<p className="card-preview__types">
				{member.type_primary}
				{member.type_secondary && ` / ${member.type_secondary}`}
			</p>
			<div className="card-preview__stats">
				<span className="card-preview__attaque">{member.attaque}</span>
				<span className="card-preview__vie">{member.vie_max}</span>
			</div>
		</aside>
	);
}
