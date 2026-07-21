import { typeNameFr } from "../i18n/type.fr";
import "./TypeBadge.css";

interface TypeBadgeProps {
	type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
	return (
		<span
			className="type-badge"
			style={{ backgroundColor: `var(--type-${type})` }}
		>
			{typeNameFr(type)}
		</span>
	);
}
