interface CandyConfirmProps {
	amount: number;
	xpGained: number;
	pending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

/** Confirmation d'une consommation TOTALE de bonbons.
 *  Rien n'est detruit — mais vider son pot d'un coup se regrette, et
 *  le bouton MAX rend le geste trop facile. On ne confirme QUE dans ce
 *  cas : une consommation partielle passe sans friction. */
export function CandyConfirm({
	amount,
	xpGained,
	pending,
	onConfirm,
	onCancel,
}: CandyConfirmProps) {
	return (
		<div className="evolution-confirm__overlay">
			<div className="evolution-confirm candy-confirm">
				<p className="evolution-confirm__question">
					Utiliser <strong>tous tes {amount} bonbons</strong> ?
				</p>

				<p className="evolution-confirm__cost">
					+{xpGained.toLocaleString("fr-FR")} XP
				</p>

				<p className="evolution-confirm__warning">
					Ton stock de bonbons sera vidé.
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
