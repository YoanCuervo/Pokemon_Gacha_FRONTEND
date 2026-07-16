import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { getPhotos } from "../services/photos.service";
import { getMe } from "../services/user.service";
import type { Photo, User } from "../types";

type UserContextValue = {
	user: User | null;
	photos: Photo[];
	activePhotoId: number | null;
	error: string | null;
	setError: (e: string | null) => void;
	loadUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [error, setError] = useState<string | null>(null);

	const loadUser = useCallback(async () => {
		try {
			const [me, photoData] = await Promise.all([getMe(), getPhotos()]);
			setUser(me);
			setPhotos(photoData.photos);
			setError(null);
		} catch (err) {
			setError(String(err));
		}
	}, []);

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	return (
		<UserContext.Provider
			value={{
				user,
				photos,
				activePhotoId: user?.active_avatar_id ?? null,
				error,
				setError,
				loadUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser hors UserProvider");
	return ctx;
}
