import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { EvolutionInfo } from "../../types";

interface EvolutionConfirmProps {
	evolution: EvolutionInfo;
	/** true pendant l'appel back : desactive les deux boutons. */
	pending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

/** Confirmation d'evolution — action IRREVERSIBLE et couteuse
 *  (jusqu'a 1000 Shiny Stones). Le seul geste de l'inventaire qui
 *  demande une validation : les autres onglets n'ont pas d'incidence
 *  destructive sur le joueur.
 *  Presentationnel pur : ne fetch rien, ne decide rien. Le parent
 *  garde l'etat (ouverte/fermee, pending) et execute l'evolution.
 *  N'est rendu que si target et stone existent (garanti par le parent). */
export function EvolutionConfirm({
	evolution,
	pending,
	onConfirm,
	onCancel,
}: EvolutionConfirmProps) {
	// Le parent ne rend ce composant que sur une evolution possible,
	// mais TS ne le sait pas : on sort proprement plutot que de mentir
	// avec un `as`.
	if (!evolution.target || !evolution.stone) return null;

	return (
		<div className="evolution-confirm__overlay">
			<div
				className={
					evolution.is_shiny_evolution
						? "evolution-confirm evolution-confirm--shiny"
						: "evolution-confirm"
				}
			>
				<p className="evolution-confirm__question">
					Évoluer <strong>{pokemonNameFr(evolution.current.pokemon_id)}</strong>{" "}
					en <strong>{pokemonNameFr(evolution.target.pokemon_id)}</strong> ?
				</p>

				<p className="evolution-confirm__cost">
					Coût : {evolution.stone_cost} {evolution.stone.name}
				</p>

				{evolution.is_shiny_evolution && (
					<p className="evolution-confirm__shiny-note">Évolution Shiny</p>
				)}

				<p className="evolution-confirm__warning">
					Cette action est irréversible.
				</p>

				<div className="evolution-confirm__actions">
					<button
						type="button"
						className="inventory__btn"
						onClick={onCancel}
						disabled={pending}
					>
						ANNULER
					</button>
					<button
						type="button"
						className="inventory__btn"
						onClick={onConfirm}
						disabled={pending}
					>
						{pending ? "…" : "CONFIRMER"}
					</button>
				</div>
			</div>
		</div>
	);
}
