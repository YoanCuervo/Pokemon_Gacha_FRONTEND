// =====================================================================
// pages/combat/PlayerBanner.tsx — Profil d'un camp, ancré à sa rangée.
// Badge = avatar (ProfilPicture, fallback maison) + pseudo. Hover =
// panneau stats. RANK/WINRATE : placeholders PVP. VITESSE/ATTAQUE/VIE :
// depuis le setup (agrégats d'affichage, le moteur ne les lit pas).
// =====================================================================

import ProfilPicture from "../../components/ProfilPicture";
import type { TeamProfile, TeamSetup } from "../../types/combat";
import { photoUrl } from "../../utils/photo";

interface Props {
	profile: TeamProfile;
	team: TeamSetup;
	side: "top" | "bottom";
}

export function PlayerBanner({ profile, team, side }: Props) {
	const attaque = team.members.reduce((sum, m) => sum + m.attaque, 0);
	const vie = team.members.reduce((sum, m) => sum + m.vie_max, 0);

	return (
		<div className="player-banner" data-side={side}>
			<ProfilPicture
				photoUrl={profile.avatar_url ? photoUrl(profile.avatar_url) : undefined}
				size={64}
			/>
			<span className="player-banner__name">{profile.display_name}</span>
			<dl className="player-banner__stats">
				<div>
					<dt>RANK</dt>
					<dd>—</dd>
				</div>
				<div>
					<dt>WINRATE</dt>
					<dd>—</dd>
				</div>
				<div>
					<dt>VITESSE</dt>
					<dd>{team.total_speed}</dd>
				</div>
				<div>
					<dt>ATTAQUE</dt>
					<dd>{attaque}</dd>
				</div>
				<div>
					<dt>VIE</dt>
					<dd>{vie}</dd>
				</div>
			</dl>
		</div>
	);
}
