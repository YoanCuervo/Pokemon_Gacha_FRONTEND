import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { getBox } from "../services/box.service";
import {
	addToTeam,
	getTeam,
	removeFromTeam,
	reorderTeam,
} from "../services/team.service";
import type { BoxResponse, TeamResponse } from "../types";
import "./Team.css";

function Team() {
	// null = boîte fermée, sinon numéro du slot cliqué (1-6)
	const [openSlot, setOpenSlot] = useState<number | null>(null);
	const [team, setTeam] = useState<TeamResponse | null>(null);
	const [box, setBox] = useState<BoxResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadData = useCallback(() => {
		getTeam()
			.then(setTeam)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			});

		getBox()
			.then(setBox)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			});
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	async function handleAddToTeam(instanceId: number) {
		if (openSlot === null) return;

		try {
			setError(null);
			await addToTeam(instanceId, openSlot);
			setOpenSlot(null); // ferme la boîte : le flux naturel
			loadData(); // recharge team + box depuis le serveur
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		}
	}

	async function handleRemoveFromTeam(slot: number) {
		try {
			setError(null);
			await removeFromTeam(slot);
			loadData();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		}
	}

	async function handleClearTeam() {
		if (!window.confirm("Vider toute l'équipe ?")) return;
		try {
			setError(null);
			await reorderTeam([]); // ordre vide = équipe vidée (contrat back)
			loadData();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		}
	}

	return (
		<div className="team-overlay">
			<div className="team-modal">
				<header className="team-header">
					<h1>TEAM</h1>
					<Link to="/" className="team-close">
						<X size={20} />
					</Link>
				</header>

				<div className="team-slots">
					{[1, 2, 3, 4, 5, 6].map((slot) => {
						const member = team?.members.find((m) => m.slot_position === slot);

						return (
							<button
								type="button"
								key={slot}
								className={`team-slot ${member ? "team-slot--filled" : ""}`}
								onClick={() =>
									member ? handleRemoveFromTeam(slot) : setOpenSlot(slot)
								}
							>
								<span className="team-slot-number">n°{slot}</span>
								{member ? (
									<div className="team-slot-card">
										<span className="team-slot-name">
											{member.name}
											{member.is_shiny && (
												<span className="team-slot-shiny">★</span>
											)}
										</span>
										<span className="team-slot-level">
											Nv {member.level} — {"★".repeat(member.stars)}
										</span>
										<span className="team-slot-types">
											{member.type_primary}
											{member.type_secondary && ` / ${member.type_secondary}`}
										</span>
									</div>
								) : (
									<span className="team-slot-empty">
										<Plus size={40} />
									</span>
								)}
							</button>
						);
					})}
				</div>

				<div className="team-bottom">
					<section className="team-stats">
						<h2>TEAM STATS</h2>
						{error && <p className="team-stats-error">{error}</p>}
						{team && (
							<ul className="team-stats-list">
								<li>
									<span>Membres</span>
									<strong>{team.members.length}/6</strong>
								</li>
								<li>
									<span>Initiative</span>
									<strong>{team.total_speed}</strong>
								</li>
								<li>
									<span>ATK</span>
									<strong>
										{team.members.reduce((sum, m) => sum + m.stats.atk, 0)}
									</strong>
								</li>
								<li>
									<span>HP</span>
									<strong>
										{team.members.reduce((sum, m) => sum + m.stats.hp, 0)}
									</strong>
								</li>
								<li>
									<span>DEF</span>
									<strong>
										{team.members.reduce((sum, m) => sum + m.stats.def, 0)}
									</strong>
								</li>
							</ul>
						)}
					</section>
					<div className="team-actions">
						<button type="button" className="btn-edit">
							EDIT POSITION
						</button>
						<button
							type="button"
							className="btn-clear"
							onClick={handleClearTeam}
						>
							CLEAR TEAM
						</button>
					</div>
				</div>
			</div>

			{openSlot !== null && (
				<div className="box-modal">
					<header className="box-header">
						<h2>BOITE POKEMON — slot n°{openSlot}</h2>
						<button
							type="button"
							className="box-close"
							onClick={() => setOpenSlot(null)}
						>
							<X size={20} />
						</button>
					</header>
					<div className="pokemon-box-grid">
						{box?.instances.map((instance) => (
							<button
								type="button"
								key={instance.instance_id}
								className="pokemon-box-slot"
								onClick={() => handleAddToTeam(instance.instance_id)}
							>
								<span className="box-slot-name">
									{instance.name}
									{instance.is_shiny && (
										<span className="box-slot-shiny">★</span>
									)}
								</span>
								<span className="box-slot-info">
									Nv {instance.level} — {"★".repeat(instance.stars)}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Team;
