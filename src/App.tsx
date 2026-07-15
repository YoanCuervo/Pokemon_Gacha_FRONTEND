import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Team from "./pages/Team";

function App() {
	return (
		<>
			<Home />
			<Routes>
				<Route path="/" element={null} />
				<Route path="/team" element={<Team />} />
			</Routes>
		</>
	);
}

export default App;
