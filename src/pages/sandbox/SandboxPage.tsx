import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
	getItemCatalog,
	getSpeciesCatalog,
} from "../../services/sandbox.service";
import type { ItemCatalogEntry, SpeciesCatalogEntry } from "../../types/combat";
import { SandboxScreen } from "./SandboxScreen";
import "./Sandbox.css";

type LoadState =
	| { status: "loading" }
	| { status: "error"; message: string }
	| {
			status: "ready";
			species: SpeciesCatalogEntry[];
			items: ItemCatalogEntry[];
	  };

/** Page du BAC A SABLE (tour d'entrainement).
 *  Charge les deux catalogues UNE fois, puis SandboxScreen filtre en
 *  memoire — 251 especes et le catalogue d'items ne bougent jamais. */
export function SandboxPage() {
	const [load, setLoad] = useState<LoadState>({ status: "loading" });

	useEffect(() => {
		let cancelled = false;
		Promise.all([getSpeciesCatalog(), getItemCatalog()])
			.then(([species, items]) => {
				if (!cancelled) setLoad({ status: "ready", species, items });
			})
			.catch((e: unknown) => {
				if (!cancelled)
					setLoad({
						status: "error",
						message: e instanceof Error ? e.message : "Erreur inconnue",
					});
			});
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className="sandbox-overlay">
			<div className="sandbox-modal-frame">
				<header className="sandbox-header">
					<h1>TOUR D'ENTRAÎNEMENT</h1>
					<Link to="/" className="sandbox-close">
						<X size={20} />
					</Link>
				</header>

				{load.status === "loading" && (
					<p className="sandbox__state">Chargement des catalogues…</p>
				)}
				{load.status === "error" && (
					<p className="sandbox__state">Erreur : {load.message}</p>
				)}
				{load.status === "ready" && (
					<SandboxScreen species={load.species} items={load.items} />
				)}
			</div>
		</div>
	);
}
