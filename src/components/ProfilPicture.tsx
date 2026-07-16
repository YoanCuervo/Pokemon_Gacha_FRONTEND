// import frameSvg from "../assets/avatar-frame.svg";
import "./ProfilPicture.css";

type ProfilPictureProps = {
	photoUrl?: string;
	level: number;
	size?: number;
};

function ProfilPicture({ photoUrl, level, size = 120 }: ProfilPictureProps) {
	return (
		<div className="pp" style={{ width: size, height: size }}>
			<div className="pp-photo">
				{photoUrl ? (
					<img src={photoUrl} alt="Phot de profil" />
				) : (
					<div className="pp-empty" />
				)}
			</div>
			<div className="pp-frame" />
			<span className="pp-level">{level}</span>
		</div>
	);
}

export default ProfilPicture;
