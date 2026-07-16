import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { getBox } from "../services/box.service";
import { getTeam } from "../services/team.service";
import type { BoxResponse, TeamResponse } from "../types";

interface TeamContextValue {
	team: TeamResponse | null;
	setTeam: (team: TeamResponse | null) => void;
	box: BoxResponse | null;
	error: string | null;
	setError: (message: string | null) => void;
	loadData: () => void;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
	const [team, setTeam] = useState<TeamResponse | null>(null);
	const [box, setBox] = useState<BoxResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadData = useCallback(() => {
		getTeam()
			.then(setTeam)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			});

		getBox()
			.then(setBox)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			});
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<TeamContext.Provider
			value={{ team, setTeam, box, error, setError, loadData }}
		>
			{children}
		</TeamContext.Provider>
	);
}

export function useTeam(): TeamContextValue {
	const context = useContext(TeamContext);
	if (!context) {
		throw new Error("useTeam doit être utilisé dans un TeamProvider");
	}
	return context;
}
