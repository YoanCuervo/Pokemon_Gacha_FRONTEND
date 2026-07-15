import { useState } from "react";
import { Link } from "react-router";
import "./Team.css";
import { Plus, X } from "lucide-react";

function Team() {
	// null = boîte fermée, sinon numéro du slot cliqué (1-6)
	const [openSlot, setOpenSlot] = useState<number | null>(null);

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
					{[1, 2, 3, 4, 5, 6].map((slot) => (
						<button
							type="button"
							key={slot}
							className="team-slot"
							onClick={() => setOpenSlot(slot)}
						>
							<span className="team-slot-number">n°{slot}</span>
							<span className="team-slot-empty">
								<Plus size={40} />
							</span>
						</button>
					))}
				</div>

				<div className="team-bottom">
					<section className="team-stats">
						<h2>TEAM STATS:</h2>
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
						{Array.from({ length: 18 }, (_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: placeholder statique, remplacé par instance.id au fetch
							<div key={`box-${i + 1}`} className="pokemon-box-slot">
								#
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Team;
