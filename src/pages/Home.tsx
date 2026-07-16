import { Link } from "react-router";
import { useTeam } from "../context/TeamContext";
import { animatedSpriteUrl } from "../utils/sprites";
import "./Home.css";

function Home() {
	const { team } = useTeam();

	return (
		<div className="home">
			{/* Bandeau haut : profil / ressources / boutique */}
			<header className="home-top">
				<div className="home-profile">
					PROFIL
					<span className="home-lvl">LVL</span>
				</div>
				<div className="home-resources">
					<div className="home-bar">ENDURANCE</div>
					<div className="home-bar">PUISSANCE</div>
					<div className="home-bar">
						POKEDOLLARDS: <span>100$</span>{" "}
					</div>
				</div>
				<div className="home-shop">BOUTIQUE</div>
			</header>

			<div className="home-middle">
				{/* Menu gauche */}
				<nav className="home-menu">
					<div className="home-menu-item">POKEDEX</div>
					<div className="home-menu-item">MISSIONS</div>
					<div className="home-menu-item">PVP</div>
				</nav>

				{/* Team au centre */}
				<div className="home-team-preview">
					{[1, 2, 3, 4, 5, 6].map((slot) => {
						const member = team?.members.find((m) => m.slot_position === slot);
						return (
							<Link key={slot} to="/team" className="home-team-slot">
								{member && (
									<img
										src={animatedSpriteUrl(member.pokemon_id, member.is_shiny)}
										alt={member.name}
										className="home-team-sprite"
									/>
								)}
							</Link>
						);
					})}
				</div>

				{/* Colonne droite */}
				<nav className="home-menu">
					<div className="home-menu-item">ALLIANCE</div>
					<div className="home-menu-item">EVENEMENTS</div>
				</nav>
			</div>

			{/* Barre basse : TEAM / chat / sac à dos */}
			<footer className="home-bottom">
				<Link to="/team" className="home-team-button">
					TEAM
				</Link>
				<div className="home-chat">CHAT ALLIANCE</div>
				<div className="home-bag">SAC À DOS</div>
			</footer>
		</div>
	);
}

export default Home;
