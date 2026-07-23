import type { XpState } from "../types";
import { apiGet, apiPost } from "./api";

export function getExperience(instanceId: number): Promise<XpState> {
	return apiGet<XpState>(`/pokemon/${instanceId}/experience`);
}

export function useCandies(
	instanceId: number,
	amount: number,
): Promise<XpState> {
	return apiPost<XpState>(`/pokemon/${instanceId}/experience`, { amount });
}
