import type { TeamResponse } from "../types";
import { apiGet } from "./api";

export function getTeam(): Promise<TeamResponse> {
	return apiGet<TeamResponse>("/team");
}
