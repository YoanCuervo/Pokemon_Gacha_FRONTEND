import { Link } from "react-router";
import "./Team.css";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getBox } from "../services/box.service";
import { getTeam } from "../services/team.service";
import type { BoxResponse, TeamResponse } from "../types";

function Team() {
	// null = boîte fermée, sinon numéro du slot cliqué (1-6)
	const [openSlot, setOpenSlot] = useState<number | null>(null);
	const [team, setTeam] = useState<TeamResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [box, setBox] = useState<BoxResponse | null>(null);

	useEffect(() => {
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

	return (
		<div className="team-overlay">
			<div className="team-modal">
				<header className="team-header">
					<h1>TEAM</h1>
					<Link to="/" className="team-close">
						<X size={20} />
					</Link>
				</header>
				{error && <p style={{ color: "var(--danger)" }}>{error}</p>}
				{team && (
					<p style={{ color: "var(--text-muted)" }}>
						{team.members.length} pokémon — vitesse totale : {team.total_speed}
					</p>
				)}
				<div className="team-slots">
					{[1, 2, 3, 4, 5, 6].map((slot) => {
						const member = team?.members.find((m) => m.slot_position === slot);

						return (
							<button
								type="button"
								key={slot}
								className={`team-slot ${member ? "team-slot--filled" : ""}`}
								onClick={() => setOpenSlot(slot)}
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
						<button type="button" className="btn-clear">
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
								onClick={() => {
									// POST à venir : ajouter instance.instance_id au slot openSlot
								}}
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
