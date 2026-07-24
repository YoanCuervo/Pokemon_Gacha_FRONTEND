import { Route, Routes } from "react-router";
import { TeamProvider } from "./context/TeamContext";
import { UserProvider } from "./context/UserContext";
import { CombatPage } from "./pages/combat/CombatPage";
import EditProfil from "./pages/EditProfil";
import FlagPicker from "./pages/FlagPicker";
import Home from "./pages/Home";
import { InventoryPage } from "./pages/inventory/InventoryPage";
import Profil from "./pages/Profil";
import { SandboxPage } from "./pages/sandbox/SandboxPage";
import Team from "./pages/Team";

function App() {
	return (
		<UserProvider>
			<TeamProvider>
				<Home />
				<Routes>
					<Route path="/" element={null} />
					<Route path="/team" element={<Team />} />
					<Route path="/combat" element={<CombatPage />} />
					<Route path="/sandbox" element={<SandboxPage />} />
					<Route path="/inventory/:instanceId" element={<InventoryPage />} />
					<Route path="/profil" element={<Profil />}>
						<Route path="edit" element={<EditProfil />}>
							<Route path="flag" element={<FlagPicker />} />
						</Route>
					</Route>
				</Routes>
			</TeamProvider>
		</UserProvider>
	);
}

export default App;
