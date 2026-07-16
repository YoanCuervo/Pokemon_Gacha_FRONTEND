import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import type { TeamMember } from "../types";

interface TeamSlotProps {
	slot: number;
	member: TeamMember | undefined;
	editMode: boolean;
	onClick: () => void;
}

function TeamSlot({ slot, member, editMode, onClick }: TeamSlotProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: slot, disabled: !editMode || !member });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<button
			type="button"
			ref={setNodeRef}
			style={style}
			className={`team-slot ${member ? "team-slot--filled" : ""} ${
				editMode && member ? "team-slot--draggable" : ""
			}`}
			onClick={editMode ? undefined : onClick}
			{...attributes}
			{...listeners}
		>
			<span className="team-slot-number">n°{slot}</span>
			{member ? (
				<div className="team-slot-card">
					<span className="team-slot-name">
						{member.name}
						{member.is_shiny && <span className="team-slot-shiny">★</span>}
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
}

export default TeamSlot;
