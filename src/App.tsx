import { Route, Routes } from "react-router";
import { PhotoProvider } from "./context/PhotoContext";
import { TeamProvider } from "./context/TeamContext";
import Home from "./pages/Home";
import Team from "./pages/Team";

function App() {
	return (
		<PhotoProvider>
			<TeamProvider>
				<Home />
				<Routes>
					<Route path="/" element={null} />
					<Route path="/team" element={<Team />} />
				</Routes>
			</TeamProvider>
		</PhotoProvider>
	);
}

export default App;
