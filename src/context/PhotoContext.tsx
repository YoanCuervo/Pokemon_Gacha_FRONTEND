import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { getPhotos } from "../services/photos.service";
import type { Photo } from "../types";

type PhotoContextValue = {
	photos: Photo[];
	activePhotoId: number | null;
	error: string | null;
	setError: (e: string | null) => void;
	loadPhotos: () => Promise<void>;
};

const PhotoContext = createContext<PhotoContextValue | null>(null);

export function PhotoProvider({ children }: { children: ReactNode }) {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadPhotos = useCallback(async () => {
		try {
			const data = await getPhotos();
			setPhotos(data.photos);
			setActivePhotoId(data.active_photo_id);
			setError(null);
		} catch (err) {
			setError(String(err));
		}
	}, []);

	useEffect(() => {
		loadPhotos();
	}, [loadPhotos]);

	return (
		<PhotoContext.Provider
			value={{ photos, activePhotoId, error, setError, loadPhotos }}
		>
			{children}
		</PhotoContext.Provider>
	);
}

export function usePhotos() {
	const ctx = useContext(PhotoContext);
	if (!ctx) throw new Error("usePhotos hors PhotoProvider");
	return ctx;
}
