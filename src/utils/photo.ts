const API_URL = import.meta.env.VITE_API_URL;

/** file_path = "uploads/avatars/xxx.png" -> URL absolue du back. */
export function photoUrl(filePath: string): string {
	return `${API_URL}/${filePath}`;
}
