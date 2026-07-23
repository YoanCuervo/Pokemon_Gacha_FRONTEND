import { pokemonNameFr } from "../../i18n/pokemon.fr";
import type { DecraftableInstance } from "../../types";
import { artworkUrl } from "../../utils/sprites";

interface DecraftConfirmProps {
	selected: DecraftableInstance[];
	pending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function DecraftConfirm({
	selected,
	pending,
	onConfirm,
	onCancel,
}: DecraftConfirmProps) {
	if (selected.length === 0) return null;

	const fragments = selected.reduce((sum, i) => sum + i.fragment_value, 0);
	const candies = selected.reduce((sum, i) => sum + i.candy_value, 0);
	const hasShiny = selected.some((i) => i.is_shiny);

	return (
		<div className="evolution-confirm__overlay">
			<div className="evolution-confirm decraft-confirm">
				<p className="evolution-confirm__question">
					Veux-tu sacrifier ces{" "}
					<strong>
						{selected.length} pokémon
						{selected.length > 1 ? "s" : ""}
					</strong>{" "}
					?
				</p>

				{/* Ce qui va disparaitre, en clair */}
				<div className="decraft-confirm__list">
					{selected.map((inst) => (
						<div key={inst.instance_id} className="decraft-confirm__item">
							<img
								src={artworkUrl(inst.pokemon_id, inst.is_shiny)}
								alt={pokemonNameFr(inst.pokemon_id)}
								className="decraft-confirm__sprite"
							/>
							<span className="decraft-confirm__label">
								{pokemonNameFr(inst.pokemon_id)}
								{inst.is_shiny && <span className="inventory__shiny">S</span>}
							</span>
							<span className="decraft-confirm__meta">
								{inst.stars}★ · Nv {inst.level}
							</span>
						</div>
					))}
				</div>

				{/* Ce qui est gagne en echange */}
				<p className="evolution-confirm__cost">
					Tu récupères : {fragments} fragment{fragments > 1 ? "s" : ""}
					{candies > 0 && ` et ${candies} bonbon${candies > 1 ? "s" : ""}`}
				</p>

				{hasShiny && (
					<p className="decraft-confirm__shiny-warning">
						Attention : un shiny sera détruit
					</p>
				)}

				<p className="evolution-confirm__warning">
					Attention : cette action est irréversible.
					<br />
					Les objets équipés retourneront dans ta réserve.
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
						className="inventory__btn inventory__btn--danger"
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
