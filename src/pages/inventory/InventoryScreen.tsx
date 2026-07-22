import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getReserve } from "../../services/item.service";
import {
	equipItem,
	evolveInstance,
	getEvolution,
	getInstance,
	unequipItem,
} from "../../services/pokemon.service";
import { getStones } from "../../services/stones.service";
import type {
	EvolutionInfo,
	InstanceDetail,
	ItemCategory,
	ReserveItem,
	UserStone,
} from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";
import { EquipmentTab } from "./EquipmentTab";
import { EvolutionConfirm } from "./EvolutionConfirm";
import { EvolutionTab } from "./EvolutionTab";
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
	const [evolution, setEvolution] = useState<EvolutionInfo | null>(null);
	const [stones, setStones] = useState<UserStone[]>([]);

	const [activeTab, setActiveTab] = useState<InventoryTab>("equipment");
	const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
		null,
	);
	const [filterType, setFilterType] = useState<string | null>(null);
	const [filterRarity, setFilterRarity] = useState<string | null>(null);

	// Confirmation d'evolution (UI pure, pas de donnee metier).
	const [confirming, setConfirming] = useState(false);
	const [evolving, setEvolving] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setLoad({ status: "loading" });
		Promise.all([
			getInstance(instanceId),
			getReserve(),
			getEvolution(instanceId),
			getStones(),
		])
			.then(([d, r, e, s]) => {
				if (cancelled) return;
				setDetail(d);
				setReserve(r);
				setEvolution(e);
				setStones(s);
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

	// Toggle du tri : re-cliquer le slot deja selectionne annule la selection
	// (n'affecte JAMAIS l'equipement — le slot ne desequipe pas).
	function handleSelectSlot(category: ItemCategory) {
		setSelectedCategory((prev) => (prev === category ? null : category));
	}

	// Bouton dynamique sous la card (onglet EQUIPEMENT) :
	//  - slot selectionne rempli  -> DESEQUIPER (retire l'item)
	//  - slot selectionne vide    -> ANNULER (annule juste la selection)
	async function handlePrimaryAction() {
		if (selectedCategory === null) return;
		const slot = detail?.equipped.find((s) => s.category === selectedCategory);
		if (slot?.item) {
			const updated = await unequipItem(instanceId, selectedCategory);
			setDetail(updated);
			setReserve(await getReserve());
		}
		// Dans les deux cas on retombe en selection nulle (tri annulé).
		setSelectedCategory(null);
	}

	async function handleEquip(itemInstanceId: number) {
		const updated = await equipItem(instanceId, itemInstanceId);
		setDetail(updated);
		setReserve(await getReserve());
	}

	// R3 — Evolution confirmee. Le POST renvoie la fiche a jour ; on
	// re-fetch evolution ET stones (l'espece a change -> nouvelle cible,
	// nouvelle pierre, et le pot a ete debite). Source de verite = le back.
	async function handleEvolve() {
		setEvolving(true);
		try {
			const updated = await evolveInstance(instanceId);
			setDetail(updated);
			const [e, s] = await Promise.all([getEvolution(instanceId), getStones()]);
			setEvolution(e);
			setStones(s);
			setConfirming(false);
		} finally {
			setEvolving(false);
		}
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

	// Le footer sous la card depend de l'onglet actif. Le panel ne connait
	// pas les regles des onglets : il affiche ce qu'on lui compose ici.
	const selectedSlotItem = selectedCategory
		? (detail?.equipped.find((s) => s.category === selectedCategory)?.item ??
			null)
		: null;

	const equipmentFooter = (
		<div className="inventory__actions">
			<button
				type="button"
				className="inventory__btn"
				disabled={selectedCategory === null}
				onClick={handlePrimaryAction}
			>
				{selectedSlotItem ? "DÉSÉQUIPER" : "ANNULER"}
			</button>
			<button type="button" className="inventory__btn" disabled>
				LEVEL UP
			</button>
		</div>
	);

	const evolutionFooter = evolution && (
		<div className="inventory__actions inventory__actions--evolution">
			{evolution.stone && evolution.stone_cost !== null ? (
				<div className="evolution__counter">
					<img
						src={itemSpriteUrl(evolution.stone.name)}
						alt={evolution.stone.name}
						className="evolution__counter-icon"
					/>
					<span className="evolution__counter-value">
						<span
							className={
								evolution.can_evolve
									? "evolution__counter-owned evolution__counter-owned--ok"
									: "evolution__counter-owned"
							}
						>
							{evolution.stones_owned}
						</span>
						{" / "}
						{evolution.stone_cost}
					</span>
				</div>
			) : (
				<p className="evolution__max">Évolution maximale atteinte</p>
			)}

			{evolution.target && (
				<button
					type="button"
					className={
						evolution.is_shiny_evolution
							? "inventory__btn inventory__btn--shiny"
							: "inventory__btn"
					}
					disabled={!evolution.can_evolve || evolving}
					onClick={() => setConfirming(true)}
				>
					ÉVOLUER
				</button>
			)}
		</div>
	);

	const footerByTab: Record<InventoryTab, React.ReactNode> = {
		equipment: equipmentFooter,
		experience: evolutionFooter,
		power: null,
	};

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
							onSelectSlot={handleSelectSlot}
							footer={footerByTab[activeTab]}
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
							{activeTab === "experience" && evolution && (
								<EvolutionTab evolution={evolution} stones={stones} />
							)}
							{activeTab === "power" && (
								<div className="inventory__placeholder">
									PUISSANCE — à venir
								</div>
							)}
						</div>

						{confirming && evolution && (
							<EvolutionConfirm
								evolution={evolution}
								pending={evolving}
								onConfirm={handleEvolve}
								onCancel={() => setConfirming(false)}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
