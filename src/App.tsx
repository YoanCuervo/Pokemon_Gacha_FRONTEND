import { Route, Routes } from "react-router";
import { PhotoProvider } from "./context/PhotoContext";
import { TeamProvider } from "./context/TeamContext";
import EditProfil from "./pages/EditProfil";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Team from "./pages/Team";

function App() {
	return (
		<PhotoProvider>
			<TeamProvider>
				<Home />
				<Routes>
					<Route path="/" element={null} />
					<Route path="/team" element={<Team />} />
					<Route path="/profil" element={<Profil />}>
						<Route path="edit" element={<EditProfil />} />
					</Route>
				</Routes>
			</TeamProvider>
		</PhotoProvider>
	);
}

export default App;
