const API_URL = "http://localhost:3001/api";

export async function apiGet<T>(path: string): Promise<T> {
	const response = await fetch(`${API_URL}${path}`);
	if (!response.ok) {
		throw new Error(`API ${response.status} on GET ${path}`);
	}
	return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		throw new Error(`API ${response.status} on POST ${path}`);
	}
	return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		throw new Error(`API ${response.status} on PATCH ${path}`);
	}
	return response.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, { method: "DELETE" });
	if (!response.ok) {
		throw new Error(`API ${response.status} on DELETE ${path}`);
	}
	return response.json() as Promise<T>;
}
