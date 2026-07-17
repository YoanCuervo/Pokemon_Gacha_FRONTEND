import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { setCountry } from "../services/user.service";
import type { CountryList } from "../types";
import { fetchCountries, flagUrl } from "../utils/flags";
import "./FlagPicker.css";

function FlagPicker() {
	const navigate = useNavigate();
	const { user, loadUser, setError } = useUser();
	const [countries, setCountries] = useState<CountryList>({});
	const [selected, setSelected] = useState<string | null>(null);

	// La liste ne bouge jamais : un seul fetch a l'ouverture.
	useEffect(() => {
		fetchCountries()
			.then(setCountries)
			.catch((err) => setError(String(err)));
	}, [setError]);

	const currentCode = selected ?? user?.country?.toLowerCase() ?? null;
	const canConfirm =
		selected !== null && selected !== user?.country?.toLowerCase();

	async function handleConfirm() {
		if (!selected) return;
		try {
			await setCountry(selected);
			await loadUser();
			navigate("/profil/edit");
		} catch (err) {
			setError(String(err));
		}
	}

	return (
		<div className="flag-overlay">
			<div className="flag-modal">
				<header className="flag-header">
					<h2>Changer de drapeau</h2>
					<button
						type="button"
						className="flag-close"
						onClick={() => navigate("/profil/edit")}
					>
						<X />
					</button>
				</header>

				<div className="flag-grid">
					{Object.entries(countries).map(([code, name]) => (
						<button
							key={code}
							type="button"
							className={`flag-item${code === currentCode ? " flag-item-selected" : ""}`}
							onClick={() => setSelected(code)}
							title={name}
						>
							<img src={flagUrl(code, 80)} alt={name} loading="lazy" />
						</button>
					))}
				</div>

				<div className="flag-actions">
					<button
						type="button"
						className="flag-confirm"
						onClick={handleConfirm}
						disabled={!canConfirm}
					>
						Confirmer
					</button>
				</div>
			</div>
		</div>
	);
}

export default FlagPicker;
