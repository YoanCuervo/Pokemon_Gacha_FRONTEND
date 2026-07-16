// import frameSvg from "../assets/avatar-frame.svg";
import "./ProfilePicture.css";

type ProfilePictureProps = {
	photoUrl?: string;
	level: number;
	size?: number;
};

function ProfilePicture({ photoUrl, level, size = 120 }: ProfilePictureProps) {
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

export default ProfilePicture;
