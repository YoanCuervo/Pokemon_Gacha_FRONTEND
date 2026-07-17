import type { Photo, PhotosResponse } from "../types";
import { apiDelete, apiGet, apiPatch } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

export function getPhotos(): Promise<PhotosResponse> {
	return apiGet<PhotosResponse>("/photos");
}

export function setActivePhoto(photoId: number): Promise<{ ok: true }> {
	return apiPatch<{ ok: true }>("/photos/active", { photo_id: photoId });
}

export function deletePhoto(photoId: number): Promise<{ ok: true }> {
	return apiDelete<{ ok: true }>(`/photos/${photoId}`);
}

export async function uploadPhoto(file: File): Promise<Photo> {
	const formData = new FormData();
	formData.append("photo", file);

	const res = await fetch(`${API_URL}/photos`, {
		method: "POST",
		body: formData,
	});
	if (!res.ok) throw new Error(`API ${res.status} on POST /photos`);
	return res.json();
}
