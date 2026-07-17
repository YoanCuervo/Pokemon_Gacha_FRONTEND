import { Pencil, X } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router";
import ProfilPicture from "../components/ProfilPicture";
import { useUser } from "../context/UserContext";
import { flagUrl } from "../utils/flags";
import { photoUrl } from "../utils/photo";
import "./Profil.css";

function Profil() {
	const navigate = useNavigate();
	const { user, photos, activePhotoId } = useUser();
	const activePhoto = photos.find((p) => p.id === activePhotoId);

	return (
		<>
			<div className="profil-overlay">
				<div className="profil-modal">
					<button
						type="button"
						className="profil-close"
						onClick={() => navigate("/")}
					>
						<X />
					</button>
					<header className="profil-header">
						<span className="profil-identity">
							{user?.country && (
								<img
									src={flagUrl(user.country, 80)}
									alt={user.country}
									className="profil-flag"
								/>
							)}{" "}
							| Niv.{user?.level} {user?.display_name} [TWiq]
						</span>
						<Link to="/profil/edit" className="profil-edit-btn">
							<Pencil size={16} />
							Éditer
						</Link>
					</header>

					<div className="profil-body">
						<ProfilPicture
							photoUrl={
								activePhoto ? photoUrl(activePhoto.file_path) : undefined
							}
							level={user?.level ?? 1}
							size={180}
						/>
						<div className="profil-stats">infos stats</div>
					</div>

					<div className="profil-badges">BADGES</div>

					<footer className="profil-foot">
						<button type="button">Paramètres</button>
						<button type="button">Déconnexion</button>
					</footer>
				</div>
			</div>

			{/* Le modal EDIT se monte ici, PAR-DESSUS (z-index superieur) */}
			<Outlet />
		</>
	);
}

export default Profil;
