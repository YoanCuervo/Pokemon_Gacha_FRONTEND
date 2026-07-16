import type { TeamResponse } from "../types";
import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export function getTeam(): Promise<TeamResponse> {
	return apiGet<TeamResponse>("/team");
}

export function addToTeam(
	pokemonInstanceId: number,
	slotPosition: number,
): Promise<unknown> {
	return apiPost("/team", {
		pokemon_instance_id: pokemonInstanceId,
		slot_position: slotPosition,
	});
}

export function removeFromTeam(slotPosition: number): Promise<unknown> {
	return apiDelete(`/team/${slotPosition}`);
}

export function reorderTeam(order: number[]): Promise<unknown> {
	return apiPatch("/team/reorder", { order });
}
