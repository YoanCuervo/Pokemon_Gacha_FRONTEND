import { Route, Routes } from "react-router";
import { TeamProvider } from "./context/TeamContext";
import Home from "./pages/Home";
import Team from "./pages/Team";

function App() {
	return (
		<TeamProvider>
			<Home />
			<Routes>
				<Route path="/" element={null} />
				<Route path="/team" element={<Team />} />
			</Routes>
		</TeamProvider>
	);
}

export default App;
