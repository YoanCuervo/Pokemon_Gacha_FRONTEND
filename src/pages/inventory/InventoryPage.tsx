import { useParams } from "react-router";
import { InventoryScreen } from "./InventoryScreen";

/** Route /inventory/:instanceId — lit l'id et le passe a l'ecran.
 *  Mince exprès : Collection pourra monter InventoryScreen directement
 *  sans passer par la route (ecran agnostique de son origine). */
export function InventoryPage() {
	const { instanceId } = useParams();
	const id = Number(instanceId);

	if (!Number.isInteger(id) || id <= 0) {
		return <p className="inventory-page__error">Instance invalide.</p>;
	}
	return <InventoryScreen instanceId={id} />;
}
