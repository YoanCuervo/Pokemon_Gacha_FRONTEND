import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import TeamSlot from "../components/TeamSlot";
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
	const [editMode, setEditMode] = useState(false);

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

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const slots = [1, 2, 3, 4, 5, 6];
		const oldIndex = slots.indexOf(Number(active.id));
		const newIndex = slots.indexOf(Number(over.id));

		// L'ordre COMPLET des instance_id, positions vides exclues (contrat back)
		const currentOrder = slots
			.map((s) => team?.members.find((m) => m.slot_position === s))
			.map((m) => m?.instance_id);

		const reordered = arrayMove(currentOrder, oldIndex, newIndex).filter(
			(id): id is number => id !== undefined,
		);

		try {
			setError(null);
			await reorderTeam(reordered);
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
				<DndContext onDragEnd={handleDragEnd}>
					<SortableContext
						items={[1, 2, 3, 4, 5, 6]}
						strategy={horizontalListSortingStrategy}
					>
						<div className="team-slots">
							{[1, 2, 3, 4, 5, 6].map((slot) => {
								const member = team?.members.find(
									(m) => m.slot_position === slot,
								);
								return (
									<TeamSlot
										key={slot}
										slot={slot}
										member={member}
										editMode={editMode}
										onClick={() =>
											member ? handleRemoveFromTeam(slot) : setOpenSlot(slot)
										}
									/>
								);
							})}
						</div>
					</SortableContext>
				</DndContext>

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
						<button
							type="button"
							className="btn-edit"
							onClick={() => setEditMode(!editMode)}
						>
							{editMode ? "TERMINER" : "EDIT POSITION"}
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
