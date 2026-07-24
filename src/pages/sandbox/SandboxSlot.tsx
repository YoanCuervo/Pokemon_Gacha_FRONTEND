import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { MemberSetup, SandboxMember } from "../../types/combat";
import { animatedSpriteUrl } from "../../utils/sprites";
import { SandboxCard } from "./SandboxCard";

interface SandboxSlotProps {
	slot: number; // 1-6
	member: SandboxMember | null;
	/** Le membre calcule par le back. null tant que la preview n'a pas
	 *  repondu (debounce de 350ms apres chaque modification). */
	setup: MemberSetup | null;
	selected: boolean;
	onClick: () => void;
}

/** Un slot de composition. Trois etats :
 *   - vide            -> un "+" invitant a remplir ;
 *   - rempli, calcule -> la carte de combat (SandboxCard) ;
 *   - rempli, en attente de la preview -> une carte minimale, le temps
 *     que le back reponde. Sans ca, la carte disparaitrait a chaque
 *     modification (clignotement). */
export function SandboxSlot({
	slot,
	member,
	setup,
	selected,
	onClick,
}: SandboxSlotProps) {
	if (!member) {
		return (
			<button
				type="button"
				className={`sandbox-slot sandbox-slot--empty${
					selected ? " sandbox-slot--selected" : ""
				}`}
				onClick={onClick}
			>
				<span className="sandbox-slot__plus">+</span>
				<span className="sandbox-slot__index">{slot}</span>
			</button>
		);
	}

	if (setup) {
		return <SandboxCard setup={setup} selected={selected} onClick={onClick} />;
	}

	// Preview pas encore arrivee : on montre deja l'espece choisie.
	return (
		<button
			type="button"
			className={`sandbox-slot sandbox-slot--pending${
				selected ? " sandbox-slot--selected" : ""
			}`}
			onClick={onClick}
		>
			<img
				src={animatedSpriteUrl(member.pokemon_id, member.is_shiny)}
				alt=""
				className="sandbox-slot__sprite"
			/>
			<span className="sandbox-slot__name">
				{pokemonNameFr(member.pokemon_id)}
			</span>
			<span className="sandbox-slot__level">Nv {member.level}</span>
		</button>
	);
}
