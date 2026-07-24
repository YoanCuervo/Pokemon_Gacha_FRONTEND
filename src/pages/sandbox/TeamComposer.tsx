import type {
	MemberSetup,
	SandboxMember,
	SandboxTeamDraft,
	SandboxTeamPreview,
} from "../../types/combat";
import { SandboxSlot } from "./SandboxSlot";

const TEAM_SIZE = 6;

interface TeamComposerProps {
	label: string;
	team: SandboxTeamDraft;
	preview: SandboxTeamPreview | null;
	selectedSlot: number | null;
	onChangeName: (name: string) => void;
	onSelectSlot: (slot: number) => void;
}

/** Une equipe composee : nom + stats sur une ligne, puis les 6 slots
 *  EN LIGNE (jamais sur deux rangs) : l'ordre est une donnee de jeu,
 *  l'adjacence en depend (COMBAT_SPEC 8.1). La disposition reprend
 *  celle du terrain de combat pour que le joueur visualise sa compo
 *  telle qu'elle se battra.
 *  Presentationnel pur : tout l'etat vit dans SandboxScreen. */
export function TeamComposer({
	label,
	team,
	preview,
	selectedSlot,
	onChangeName,
	onSelectSlot,
}: TeamComposerProps) {
	// Le draft porte 6 slots dont certains peuvent etre vides (null) :
	// laisser un trou est un choix de compo, pas un oubli.
	const memberAt = (slot: number): SandboxMember | null =>
		team.slots[slot - 1] ?? null;

	const setupAt = (slot: number): MemberSetup | null =>
		preview?.members.find((m) => m.slot_position === slot) ?? null;

	return (
		<div className="team-composer">
			<div className="team-composer__header">
				<span className="team-composer__label">{label}</span>

				<input
					type="text"
					className="team-composer__name"
					value={team.name}
					placeholder="Nom de la compo"
					maxLength={40}
					onChange={(e) => onChangeName(e.target.value)}
				/>

				{/* Stats agregees, calculees par le back. SPEED decide de
				    l'initiative (COMBAT_SPEC 4.1) — la seule stat d'equipe
				    qui a un effet mecanique. */}
				<div className="team-composer__stats">
					<span className="team-composer__stat">
						<span className="team-composer__stat-label">ATT</span>
						<span className="team-composer__stat-value team-composer__stat-value--atk">
							{preview?.total_attaque ?? "—"}
						</span>
					</span>
					<span className="team-composer__stat">
						<span className="team-composer__stat-label">VIE</span>
						<span className="team-composer__stat-value team-composer__stat-value--vie">
							{preview?.total_vie ?? "—"}
						</span>
					</span>
					<span className="team-composer__stat">
						<span className="team-composer__stat-label">VIT</span>
						<span className="team-composer__stat-value">
							{preview?.total_speed ?? "—"}
						</span>
					</span>
				</div>
			</div>

			<div className="team-composer__slots">
				{Array.from({ length: TEAM_SIZE }, (_, i) => {
					const slot = i + 1;
					return (
						<SandboxSlot
							key={slot}
							slot={slot}
							member={memberAt(slot)}
							setup={setupAt(slot)}
							selected={selectedSlot === slot}
							onClick={() => onSelectSlot(slot)}
						/>
					);
				})}
			</div>
		</div>
	);
}
