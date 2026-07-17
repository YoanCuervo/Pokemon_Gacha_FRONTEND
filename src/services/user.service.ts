import type { User } from "../types";
import { apiGet, apiPatch } from "./api";

export function getMe(): Promise<User> {
	return apiGet<User>("/me");
}

export function setCountry(country: string): Promise<{ ok: true }> {
	return apiPatch<{ ok: true }>("/me/country", { country });
}
