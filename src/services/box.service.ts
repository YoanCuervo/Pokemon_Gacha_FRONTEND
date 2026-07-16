import type { BoxResponse } from "../types";
import { apiGet } from "./api";

export function getBox(): Promise<BoxResponse> {
	return apiGet<BoxResponse>("/box");
}
