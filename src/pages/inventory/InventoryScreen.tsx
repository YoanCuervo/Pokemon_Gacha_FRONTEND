import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getReserve } from "../../services/item.service";
import {
	equipItem,
	getInstance,
	unequipItem,
} from "../../services/pokemon.service";
import type { InstanceDetail, ItemCategory, ReserveItem } from "../../types";
import { EquipmentTab } from "./EquipmentTab";
import { type InventoryTab, InventoryTabs } from "./InventoryTabs";
import { PokemonPanel } from "./PokemonPanel";
import "./Inventory.css";

type LoadState =
	| { status: "loading" }
	| { status: "error"; message: string }
	| { status: "ready" };

export function InventoryScreen({ instanceId }: { instanceId: number }) {
	const [load, setLoad] = useState<LoadState>({ status: "loading" });
	const [detail, setDetail] = useState<InstanceDetail | null>(null);
	const [reserve, setReserve] = useState<ReserveItem[]>([]);

	const [activeTab, setActiveTab] = useState<InventoryTab>("equipment");
	const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
		null,
	);
	const [filterType, setFilterType] = useState<string | null>(null);
	const [filterRarity, setFilterRarity] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoad({ status: "loading" });
		Promise.all([getInstance(instanceId), getReserve()])
			.then(([d, r]) => {
				if (cancelled) return;
				setDetail(d);
				setReserve(r);
				setLoad({ status: "ready" });
			})
			.catch((e: unknown) => {
				if (cancelled) return;
				setLoad({
					status: "error",
					message: e instanceof Error ? e.message : "Erreur inconnue",
				});
			});
		return () => {
			cancelled = true;
		};
	}, [instanceId]);

	async function handleEquip(itemInstanceId: number) {
		const updated = await equipItem(instanceId, itemInstanceId);
		setDetail(updated);
		setReserve(await getReserve());
	}

	async function handleUnequip(category: ItemCategory) {
		const updated = await unequipItem(instanceId, category);
		setDetail(updated);
		setReserve(await getReserve());
		if (selectedCategory === category) setSelectedCategory(null);
	}

	const pokemonType = detail?.instance.type_primary ?? null;
	const pokemonTypeSecondary = detail?.instance.type_secondary ?? null;

	const visibleItems = useMemo(() => {
		return reserve.filter((it) => {
			if (selectedCategory && it.category !== selectedCategory) return false;
			if (filterType && it.required_type !== filterType) return false;
			if (filterRarity && it.rarity !== filterRarity) return false;
			return true;
		});
	}, [reserve, selectedCategory, filterType, filterRarity]);

	return (
		<div className="inventory-overlay">
			<div className="inventory-modal">
				<header className="inventory-header">
					<h1>INVENTAIRE</h1>
					<Link to="/" className="inventory-close">
						<X size={20} />
					</Link>
				</header>

				{load.status === "loading" && (
					<p className="inventory__state">Chargement…</p>
				)}
				{load.status === "error" && (
					<p className="inventory__state">Erreur : {load.message}</p>
				)}

				{load.status === "ready" && detail && (
					<div className="inventory">
						<PokemonPanel
							instance={detail.instance}
							equipped={detail.equipped}
							selectedCategory={selectedCategory}
							onSelectSlot={setSelectedCategory}
							onUnequip={handleUnequip}
						/>

						<div className="inventory__right">
							<InventoryTabs activeTab={activeTab} onChangeTab={setActiveTab} />

							{activeTab === "equipment" && (
								<EquipmentTab
									items={visibleItems}
									pokemonType={pokemonType}
									pokemonTypeSecondary={pokemonTypeSecondary}
									filterType={filterType}
									filterRarity={filterRarity}
									onChangeType={setFilterType}
									onChangeRarity={setFilterRarity}
									onEquip={handleEquip}
								/>
							)}
							{activeTab === "experience" && (
								<div className="inventory__placeholder">
									EXPÉRIENCE — à venir
								</div>
							)}
							{activeTab === "power" && (
								<div className="inventory__placeholder">
									PUISSANCE — à venir
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
