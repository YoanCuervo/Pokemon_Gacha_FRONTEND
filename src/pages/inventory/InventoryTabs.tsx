export type InventoryTab = "experience" | "equipment" | "power";

interface InventoryTabsProps {
	activeTab: InventoryTab;
	onChangeTab: (tab: InventoryTab) => void;
}

const TABS: { key: InventoryTab; label: string }[] = [
	{ key: "experience", label: "EXPÉRIENCE" },
	{ key: "equipment", label: "ÉQUIPEMENT" },
	{ key: "power", label: "PUISSANCE" },
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
