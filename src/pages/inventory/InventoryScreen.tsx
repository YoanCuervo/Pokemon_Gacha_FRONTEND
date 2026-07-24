import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FragmentTokenFromInstance } from "../../components/FragmentToken";
import { getExperience, useCandies } from "../../services/experience.service";
import { getReserve } from "../../services/item.service";
import {
	equipItem,
	evolveInstance,
	getEvolution,
	getInstance,
	unequipItem,
} from "../../services/pokemon.service";
import {
	decraftInstances,
	getPower,
	upgradeStar,
} from "../../services/power.service";
import { getStones } from "../../services/stones.service";
import type {
	EvolutionInfo,
	InstanceDetail,
	ItemCategory,
	PowerState,
	ReserveItem,
	UserStone,
	XpState,
} from "../../types";
import { itemSpriteUrl } from "../../utils/sprites";
import { CandyConfirm } from "./CandyConfirm";
import { DecraftConfirm } from "./DecraftConfirm";
import { EquipmentTab } from "./EquipmentTab";
import { EvolutionConfirm } from "./EvolutionConfirm";
import { EvolutionTab } from "./EvolutionTab";
import { ExperienceTab } from "./ExperienceTab";
import { type InventoryTab, InventoryTabs } from "./InventoryTabs";
import { PokemonPanel } from "./PokemonPanel";
import { PowerTab } from "./PowerTab";
import { XpBar } from "./XpBar";
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
	const [power, setPower] = useState<PowerState | null>(null);
	const [xp, setXp] = useState<XpState | null>(null);

	const [activeTab, setActiveTab] = useState<InventoryTab>("equipment");
	const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
		null,
	);
	const [filterType, setFilterType] = useState<string | null>(null);
	const [filterRarity, setFilterRarity] = useState<string | null>(null);

	// Confirmation d'evolution (UI pure, pas de donnee metier).
	const [confirming, setConfirming] = useState(false);
	const [evolving, setEvolving] = useState(false);

	// PUISSANCE : selection de doublons + confirmation de decraft.
	// La selection vit ici (pas dans PowerTab) : la modale en a besoin
	// pour afficher ce qui va etre detruit.
	const [selectedDecraft, setSelectedDecraft] = useState<number[]>([]);
	const [confirmingDecraft, setConfirmingDecraft] = useState(false);
	const [decrafting, setDecrafting] = useState(false);
	const [upgrading, setUpgrading] = useState(false);

	// EXPERIENCE : quantite au stepper, confirmation du geste MAX.
	const [candyAmount, setCandyAmount] = useState(1);
	const [confirmingCandy, setConfirmingCandy] = useState(false);
	const [usingCandy, setUsingCandy] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setLoad({ status: "loading" });
		Promise.all([
			getInstance(instanceId),
			getReserve(),
			getEvolution(instanceId),
			getStones(),
			getPower(instanceId),
			getExperience(instanceId),
		])
			.then(([d, r, e, s, p, x]) => {
				if (cancelled) return;
				setDetail(d);
				setReserve(r);
				setEvolution(e);
				setStones(s);
				setPower(p);
				setXp(x);
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

	// PUISSANCE — coche/decoche un doublon dans la grille.
	function handleToggleDecraft(id: number) {
		setSelectedDecraft((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	}

	// R1 — Decraft confirme. DESTRUCTIF : les instances disparaissent.
	// Le POST renvoie l'etat a jour ; on re-fetch aussi la fiche (les
	// items des sacrifies sont revenus en reserve) et l'XP (le decraft
	// rend des bonbons), puis on vide la selection.
	async function handleDecraft() {
		setDecrafting(true);
		try {
			const result = await decraftInstances(instanceId, selectedDecraft);
			setPower(result.state);
			const [r, x] = await Promise.all([
				getReserve(),
				getExperience(instanceId),
			]);
			setReserve(r);
			setXp(x);
			setSelectedDecraft([]);
			setConfirmingDecraft(false);
		} finally {
			setDecrafting(false);
		}
	}

	// R2 — Monter une etoile. Le POST renvoie l'etat a jour ; on re-fetch
	// la fiche car la card affiche le bandeau d'etoiles.
	async function handleUpgradeStar() {
		setUpgrading(true);
		try {
			const updated = await upgradeStar(instanceId);
			setPower(updated);
			setDetail(await getInstance(instanceId));
		} finally {
			setUpgrading(false);
		}
	}

	// EXPERIENCE — le USE demande confirmation UNIQUEMENT s'il vide le
	// pot entier (le bouton MAX rend ce geste trop facile a declencher).
	function handleUseCandies() {
		if (!xp) return;
		if (candyAmount >= xp.candies_owned && xp.candies_owned > 0) {
			setConfirmingCandy(true);
			return;
		}
		void runUseCandies();
	}

	// Consomme les bonbons. Le niveau peut monter de PLUSIEURS crans d'un
	// coup : le back recalcule depuis l'xp cumulee. On re-fetch la fiche
	// (la card affiche le niveau) et on remet le stepper a 1.
	async function runUseCandies() {
		setUsingCandy(true);
		try {
			const updated = await useCandies(instanceId, candyAmount);
			setXp(updated);
			setDetail(await getInstance(instanceId));
			setCandyAmount(1);
			setConfirmingCandy(false);
		} finally {
			setUsingCandy(false);
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

	// Les instances selectionnees, resolues en objets complets pour la
	// modale (elle affiche sprites, etoiles, rendement).
	const selectedInstances = useMemo(() => {
		if (!power) return [];
		return power.decraftable.filter((d) =>
			selectedDecraft.includes(d.instance_id),
		);
	}, [power, selectedDecraft]);

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

	// Footer PUISSANCE : le pot de fragments "possede / requis" + USE.
	// next_star_cost null = 5 etoiles atteintes, plus rien a monter.
	const powerFooter = power && detail && (
		<div className="inventory__actions inventory__actions--evolution">
			{power.next_star_cost !== null ? (
				<>
					<div className="evolution__counter">
						<FragmentTokenFromInstance instance={detail.instance} />
						<span className="evolution__counter-value">
							<span
								className={
									power.can_upgrade
										? "evolution__counter-owned evolution__counter-owned--ok"
										: "evolution__counter-owned"
								}
							>
								{power.fragments_owned}
							</span>
							{" / "}
							{power.next_star_cost}
						</span>
					</div>
					<button
						type="button"
						className="inventory__btn"
						disabled={!power.can_upgrade || upgrading}
						onClick={handleUpgradeStar}
					>
						{upgrading ? "…" : "USE"}
					</button>
				</>
			) : (
				<p className="evolution__max">Puissance maximale atteinte</p>
			)}
		</div>
	);

	// Footer EXPERIENCE : la barre de progression du niveau. Elle anime
	// les montees (plusieurs niveaux possibles d'un coup).
	const experienceFooter = xp && (
		<div className="inventory__actions inventory__actions--experience">
			<XpBar
				level={xp.level}
				xpIntoLevel={xp.xp_into_level}
				xpForNextLevel={xp.xp_for_next_level}
				isMaxLevel={xp.is_max_level}
			/>
		</div>
	);

	const footerByTab: Record<InventoryTab, React.ReactNode> = {
		evolution: evolutionFooter,
		equipment: equipmentFooter,
		power: powerFooter,
		experience: experienceFooter,
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

							{activeTab === "evolution" && evolution && (
								<EvolutionTab evolution={evolution} stones={stones} />
							)}
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
							{activeTab === "power" && power && (
								<PowerTab
									decraftable={power.decraftable}
									selectedIds={selectedDecraft}
									onToggleSelect={handleToggleDecraft}
									onOpenConfirm={() => setConfirmingDecraft(true)}
								/>
							)}
							{activeTab === "experience" && xp && (
								<ExperienceTab
									xp={xp}
									amount={candyAmount}
									onChangeAmount={setCandyAmount}
									onUse={handleUseCandies}
									pending={usingCandy}
								/>
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

						{confirmingDecraft && (
							<DecraftConfirm
								selected={selectedInstances}
								pending={decrafting}
								onConfirm={handleDecraft}
								onCancel={() => setConfirmingDecraft(false)}
							/>
						)}

						{confirmingCandy && xp && (
							<CandyConfirm
								amount={candyAmount}
								xpGained={candyAmount * xp.candy_xp_value}
								pending={usingCandy}
								onConfirm={runUseCandies}
								onCancel={() => setConfirmingCandy(false)}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
