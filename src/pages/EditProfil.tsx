import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { usePhotos } from "../context/PhotoContext";
import {
	deletePhoto,
	setActivePhoto,
	uploadPhoto,
} from "../services/photos.service";
import { photoUrl } from "../utils/photo";
import "./EditProfil.css";
import { SquareMinus, X } from "lucide-react";

const SLOTS = [1, 2, 3, 4];

function EditProfil() {
	const navigate = useNavigate();
	const { photos, activePhotoId, loadPhotos, setError } = usePhotos();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const currentId = selectedId ?? activePhotoId;
	const canUse = selectedId !== null && selectedId !== activePhotoId;

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			await uploadPhoto(file);
			await loadPhotos();
		} catch (err) {
			setError(String(err));
		}
		e.target.value = "";
	}

	async function handleDelete(photoId: number) {
		if (!window.confirm("Supprimer cette photo ?")) return;
		try {
			await deletePhoto(photoId);
			if (selectedId === photoId) setSelectedId(null);
			await loadPhotos();
		} catch (err) {
			setError(String(err));
		}
	}

	async function handleUse() {
		if (selectedId === null) return;
		try {
			await setActivePhoto(selectedId);
			await loadPhotos();
			setSelectedId(null);
		} catch (err) {
			setError(String(err));
		}
	}

	return (
		<div className="edit-overlay">
			<div className="edit-modal">
				<header className="edit-header">
					<h2>Éditer le profil</h2>
					<button
						type="button"
						className="edit-close"
						onClick={() => navigate("/profil")}
					>
						<X />
					</button>
				</header>

				<div className="edit-slots">
					{SLOTS.map((slot) => {
						const photo = photos.find((p) => p.slot_position === slot);

						if (!photo) {
							return (
								<button
									key={slot}
									type="button"
									className="edit-slot edit-slot-empty"
									onClick={() => fileInputRef.current?.click()}
								>
									+
								</button>
							);
						}

						const isSelected = photo.id === currentId;
						return (
							<div
								key={slot}
								className={`edit-slot${isSelected ? " edit-slot-selected" : ""}`}
							>
								<button
									type="button"
									className="edit-slot-pick"
									onClick={() => setSelectedId(photo.id)}
								>
									<img src={photoUrl(photo.file_path)} alt="" />
								</button>
								<button
									type="button"
									className="edit-slot-delete"
									onClick={() => handleDelete(photo.id)}
								>
									<SquareMinus size={16} />
								</button>
							</div>
						);
					})}
				</div>

				<div className="edit-actions">
					<button
						type="button"
						className="edit-use"
						onClick={handleUse}
						disabled={!canUse}
					>
						Utiliser
					</button>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onChange={handleFileChange}
					hidden
				/>
			</div>
		</div>
	);
}

export default EditProfil;
