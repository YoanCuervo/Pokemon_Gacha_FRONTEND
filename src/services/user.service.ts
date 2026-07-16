import type { User } from "../types";
import { apiGet } from "./api";

export function getMe(): Promise<User> {
	return apiGet<User>("/me");
}
