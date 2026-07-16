const API_URL = "http://localhost:3001/api";

export async function apiGet<T>(path: string): Promise<T> {
	const response = await fetch(`${API_URL}${path}`);
	if (!response.ok) {
		throw new Error(`API ${response.status} on GET ${path}`);
	}
	return response.json() as Promise<T>;
}
