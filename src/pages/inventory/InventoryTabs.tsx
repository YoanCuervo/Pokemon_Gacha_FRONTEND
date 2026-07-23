export type InventoryTab = "evolution" | "equipment" | "power" | "experience";

interface InventoryTabsProps {
	activeTab: InventoryTab;
	onChangeTab: (tab: InventoryTab) => void;
}

/** Ordre d'affichage fige (wireframe) :
 *  EVOLUTION (pierres) - EQUIPEMENT (items) - PUISSANCE (etoiles/decraft)
 *  - EXPERIENCE (bonbons XP). */
const TABS: { key: InventoryTab; label: string }[] = [
	{ key: "evolution", label: "ÉVOLUTION" },
	{ key: "equipment", label: "ÉQUIPEMENT" },
	{ key: "power", label: "PUISSANCE" },
	{ key: "experience", label: "EXPÉRIENCE" },
];

export function InventoryTabs({ activeTab, onChangeTab }: InventoryTabsProps) {
	return (
		<div className="inventory__tabs">
			{TABS.map((t) => (
				<button
					key={t.key}
					type="button"
					className={`inventory__tab ${
						activeTab === t.key ? "inventory__tab--active" : ""
					}`}
					onClick={() => onChangeTab(t.key)}
				>
					{t.label}
				</button>
			))}
		</div>
	);
}
