import { useEffect, useMemo, useState } from "react";
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

	// Chargement initial : fiche + reserve en parallele.
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

	// Equiper : le back renvoie la fiche a jour (on la prend), puis on
	// re-fetch la reserve (source de verite unique — cf remplacement
	// atomique qui peut RENDRE un item a la reserve).
	async function handleEquip(itemInstanceId: number) {
		const updated = await equipItem(instanceId, itemInstanceId);
		setDetail(updated);
		setReserve(await getReserve());
	}

	// Desequiper un slot : idem, fiche + reserve re-synchronisees.
	async function handleUnequip(category: ItemCategory) {
		const updated = await unequipItem(instanceId, category);
		setDetail(updated);
		setReserve(await getReserve());
		if (selectedCategory === category) setSelectedCategory(null);
	}

	// Type primaire du pokemon : sert au grisage des items incompatibles.
	const pokemonType = detail?.instance.type_primary ?? null;
	const pokemonTypeSecondary = detail?.instance.type_secondary ?? null;

	// Liste visible = reserve ∩ categorie-du-slot ∩ type ∩ rarete.
	// La categorie vient du SLOT selectionne (pas d'un filtre manuel).
	const visibleItems = useMemo(() => {
		return reserve.filter((it) => {
			if (selectedCategory && it.category !== selectedCategory) return false;
			if (filterType && it.required_type !== filterType) return false;
			if (filterRarity && it.rarity !== filterRarity) return false;
			return true;
		});
	}, [reserve, selectedCategory, filterType, filterRarity]);

	if (load.status === "loading")
		return <p className="inventory-page__loading">Chargement…</p>;
	if (load.status === "error")
		return <p className="inventory-page__error">Erreur : {load.message}</p>;
	if (!detail) return null;

	return (
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
					<div className="inventory__placeholder">EXPÉRIENCE — à venir</div>
				)}
				{activeTab === "power" && (
					<div className="inventory__placeholder">PUISSANCE — à venir</div>
				)}
			</div>
		</div>
	);
}
