import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
	previewSandbox,
	runSandboxCombat,
} from "../../services/sandbox.service";
import type {
	ItemCatalogEntry,
	SandboxMember,
	SandboxPayload,
	SandboxPreview,
	SandboxTeamDraft,
	SandboxTeamPreview,
	SpeciesCatalogEntry,
	TeamKey,
} from "../../types/combat";
import { MemberEditor } from "./MemberEditor";
import { TeamComposer } from "./TeamComposer";

const TEAM_SIZE = 6;

/** Delai avant de demander la preview au back. Le joueur tape un
 *  niveau chiffre par chiffre : sans debounce on ferait 3 requetes
 *  pour "150". */
const PREVIEW_DEBOUNCE_MS = 350;

/** Cle localStorage du BROUILLON de travail (les deux equipes).
 *  Versionnee : si la forme de SandboxTeamDraft change, on bump et
 *  l'ancien brouillon est simplement ignore. Les sauvegardes DURABLES
 *  (3 slots nommes) seront en BDD — Lot 2. */
const STORAGE_KEY = "sandbox.teams.v1";

/** Une equipe vide : 6 trous. */
function emptyTeam(name: string): SandboxTeamDraft {
	return { name, slots: Array(TEAM_SIZE).fill(null) };
}

/** Relit une equipe du localStorage en NETTOYANT silencieusement :
 *  - forme invalide -> equipe vide (jamais de crash au montage) ;
 *  - espece disparue du catalogue -> slot vide ;
 *  - item disparu -> item retire, le membre survit.
 *  Le catalogue a pu changer entre deux sessions (migrations SQL) :
 *  on garde le maximum plutot que de tout jeter. */
function sanitizeTeam(
	raw: unknown,
	fallbackName: string,
	species: SpeciesCatalogEntry[],
	items: ItemCatalogEntry[],
): SandboxTeamDraft {
	if (typeof raw !== "object" || raw === null) return emptyTeam(fallbackName);
	const candidate = raw as { name?: unknown; slots?: unknown };
	const name =
		typeof candidate.name === "string" && candidate.name.trim() !== ""
			? candidate.name
			: fallbackName;
	const rawSlots: unknown[] = Array.isArray(candidate.slots)
		? candidate.slots
		: [];
	if (rawSlots.length === 0) return emptyTeam(name);

	const speciesIds = new Set(species.map((s) => s.pokemon_id));
	const itemIds = new Set(items.map((it) => it.template_id));

	const slots: (SandboxMember | null)[] = Array.from(
		{ length: TEAM_SIZE },
		(_, i) => {
			const m = rawSlots[i] as SandboxMember | null | undefined;
			if (!m || typeof m !== "object") return null;
			if (!speciesIds.has(m.pokemon_id)) return null;
			return {
				pokemon_id: m.pokemon_id,
				level: typeof m.level === "number" ? m.level : 50,
				stars: typeof m.stars === "number" ? m.stars : 3,
				is_shiny: Boolean(m.is_shiny),
				item_template_ids: Array.isArray(m.item_template_ids)
					? m.item_template_ids.filter((id) => itemIds.has(id))
					: [],
			};
		},
	);

	return { name, slots };
}

/** Compacte un draft (avec trous) vers le format attendu par le back.
 *  Renvoie aussi la table de correspondance slot_back -> slot_draft,
 *  pour remapper la preview sur les positions affichees. */
function compact(draft: SandboxTeamDraft): {
	members: SandboxMember[];
	slotMap: number[]; // slotMap[i] = position dans le draft du i-eme membre
} {
	const members: SandboxMember[] = [];
	const slotMap: number[] = [];
	draft.slots.forEach((m, index) => {
		if (m) {
			members.push(m);
			slotMap.push(index + 1);
		}
	});
	return { members, slotMap };
}

/** Remappe une preview du back (positions compactees) sur les positions
 *  du draft (avec trous). Sans ca, un pokemon au slot 4 verrait les
 *  stats du slot 2. */
function remapPreview(
	preview: SandboxTeamPreview | null,
	slotMap: number[],
): SandboxTeamPreview | null {
	if (!preview) return null;
	return {
		...preview,
		members: preview.members.map((m) => ({
			...m,
			slot_position: slotMap[m.slot_position - 1] ?? m.slot_position,
		})),
	};
}

interface SandboxScreenProps {
	species: SpeciesCatalogEntry[];
	items: ItemCatalogEntry[];
}

export function SandboxScreen({ species, items }: SandboxScreenProps) {
	const navigate = useNavigate();

	// Init depuis le brouillon localStorage, nettoye contre le catalogue
	// (initialiseur paresseux : lu UNE fois au montage, pas a chaque rendu).
	const [teamA, setTeamA] = useState<SandboxTeamDraft>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const parsed = stored ? JSON.parse(stored) : null;
			return sanitizeTeam(parsed?.a, "Équipe A", species, items);
		} catch {
			return emptyTeam("Équipe A");
		}
	});
	const [teamB, setTeamB] = useState<SandboxTeamDraft>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const parsed = stored ? JSON.parse(stored) : null;
			return sanitizeTeam(parsed?.b, "Équipe B", species, items);
		} catch {
			return emptyTeam("Équipe B");
		}
	});

	// Le brouillon survit a la navigation : chaque changement est ecrit.
	// Le reset n'a pas de purge a faire — il ecrit des equipes vides.
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: teamA, b: teamB }));
		} catch {
			// Stockage plein ou indisponible : le brouillon ne survivra
			// pas a la navigation, mais l'ecran reste fonctionnel.
		}
	}, [teamA, teamB]);

	// Le slot en cours d'edition : quelle equipe, quelle position.
	const [editing, setEditing] = useState<{
		key: TeamKey;
		slot: number;
	} | null>(null);

	const [preview, setPreview] = useState<SandboxPreview | null>(null);
	const [launching, setLaunching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Compactage : ce qu'on envoie au back + comment remapper le retour.
	const compactA = useMemo(() => compact(teamA), [teamA]);
	const compactB = useMemo(() => compact(teamB), [teamB]);

	const payload = useMemo<SandboxPayload>(
		() => ({
			teams: {
				a: { name: teamA.name, members: compactA.members },
				b: { name: teamB.name, members: compactB.members },
			},
		}),
		[teamA.name, teamB.name, compactA.members, compactB.members],
	);

	// Deux seuils distincts :
	//  - la PREVIEW part des le premier pokemon place, meme si l'autre
	//    equipe est vide (on compose l'une puis l'autre) ;
	//  - le COMBAT exige les deux (on ne se bat pas contre le vide).
	const anyFilled = compactA.members.length > 0 || compactB.members.length > 0;
	const bothFilled = compactA.members.length > 0 && compactB.members.length > 0;

	// Preview temps reel, debouncee. Le back calcule, jamais le front :
	// ce que le joueur voit ici est EXACTEMENT ce qui entrera en combat.
	useEffect(() => {
		if (!anyFilled) {
			setPreview(null);
			return;
		}
		let cancelled = false;
		const timer = setTimeout(() => {
			previewSandbox(payload)
				.then((p) => {
					if (!cancelled) {
						setPreview(p);
						setError(null);
					}
				})
				.catch((e: unknown) => {
					if (!cancelled) {
						setPreview(null);
						setError(e instanceof Error ? e.message : "Erreur inconnue");
					}
				});
		}, PREVIEW_DEBOUNCE_MS);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [payload, anyFilled]);

	// Les previews remappees sur les positions affichees (trous compris).
	const previewA = useMemo(
		() => remapPreview(preview?.teams.a ?? null, compactA.slotMap),
		[preview, compactA.slotMap],
	);
	const previewB = useMemo(
		() => remapPreview(preview?.teams.b ?? null, compactB.slotMap),
		[preview, compactB.slotMap],
	);

	const setTeam = useCallback((key: TeamKey, next: SandboxTeamDraft) => {
		if (key === "a") setTeamA(next);
		else setTeamB(next);
	}, []);

	const teamOf = (key: TeamKey) => (key === "a" ? teamA : teamB);

	// Les template_ids d'items UNIQUES deja portes par les AUTRES membres
	// de l'equipe en cours d'edition. Le slot edite est exclu : son propre
	// item ne doit pas se griser lui-meme dans le picker. La regle est
	// celle du back (DUPLICATE_UNIQUE_ITEM) : ici on ne fait que
	// l'ANTICIPER pour que le joueur ne puisse pas la violer.
	const usedUniqueIds = useMemo<number[]>(() => {
		if (!editing) return [];
		const team = teamOf(editing.key);
		const ids = new Set<number>();
		team.slots.forEach((member, index) => {
			if (!member || index === editing.slot - 1) return;
			for (const id of member.item_template_ids) {
				const it = items.find((x) => x.template_id === id);
				if (it?.is_unique) ids.add(id);
			}
		});
		return [...ids];
		// teamOf depend de teamA/teamB : on les liste explicitement.
	}, [editing, teamA, teamB, items]);

	/** Écrit (ou efface) un membre dans un slot. */
	function handleSaveMember(member: SandboxMember | null) {
		if (!editing) return;
		const team = teamOf(editing.key);
		const slots = [...team.slots];
		slots[editing.slot - 1] = member;
		setTeam(editing.key, { ...team, slots });
		setEditing(null);
	}

	/** Vide une equipe (nom compris). L'ecriture localStorage suit via
	 *  l'effet : pas de purge manuelle. Ferme l'editeur s'il portait
	 *  sur cette equipe — on n'edite pas un slot d'une equipe videe. */
	function handleReset(key: TeamKey) {
		setTeam(key, emptyTeam(key === "a" ? "Équipe A" : "Équipe B"));
		if (editing?.key === key) setEditing(null);
	}

	async function handleLaunch() {
		setLaunching(true);
		setError(null);
		try {
			const log = await runSandboxCombat(payload);
			navigate("/combat", { state: { log, sandboxPayload: payload } });
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "Erreur inconnue");
			setLaunching(false);
		}
	}

	const editingMember = editing
		? (teamOf(editing.key).slots[editing.slot - 1] ?? null)
		: null;

	return (
		<div className="sandbox">
			<div className="sandbox__teams">
				<TeamComposer
					label="ÉQUIPE A"
					team={teamA}
					preview={previewA}
					selectedSlot={editing?.key === "a" ? editing.slot : null}
					onChangeName={(name) => setTeamA({ ...teamA, name })}
					onSelectSlot={(slot) => setEditing({ key: "a", slot })}
					onReset={() => handleReset("a")}
				/>
				<TeamComposer
					label="ÉQUIPE B"
					team={teamB}
					preview={previewB}
					selectedSlot={editing?.key === "b" ? editing.slot : null}
					onChangeName={(name) => setTeamB({ ...teamB, name })}
					onSelectSlot={(slot) => setEditing({ key: "b", slot })}
					onReset={() => handleReset("b")}
				/>
			</div>

			{error && <p className="sandbox__error">{error}</p>}

			<div className="sandbox__actions">
				<button
					type="button"
					className="inventory__btn"
					disabled={!bothFilled || launching}
					onClick={handleLaunch}
				>
					{launching ? "…" : "LANCER LE COMBAT"}
				</button>
			</div>

			{editing && (
				<MemberEditor
					teamLabel={editing.key === "a" ? "ÉQUIPE A" : "ÉQUIPE B"}
					slot={editing.slot}
					member={editingMember}
					species={species}
					items={items}
					usedUniqueIds={usedUniqueIds}
					onSave={handleSaveMember}
					onDelete={() => handleSaveMember(null)}
					onCancel={() => setEditing(null)}
				/>
			)}
		</div>
	);
}
