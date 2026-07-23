import type { InstanceIdentity } from "../types";
import { artworkUrl } from "../utils/sprites";
import "./FragmentToken.css";

interface FragmentTokenProps {
	pokemonId: number;
	isShiny?: boolean;
	size?: number;
}

export function FragmentToken({
	pokemonId,
	isShiny = false,
	size = 38,
}: FragmentTokenProps) {
	return (
		<span
			className={
				isShiny ? "fragment-token fragment-token--shiny" : "fragment-token"
			}
			style={{ width: size, height: size }}
		>
			<img
				src={artworkUrl(pokemonId, isShiny)}
				alt=""
				className="fragment-token__sprite"
				style={{ width: size * 0.79, height: size * 0.79 }}
			/>
		</span>
	);
}

export function FragmentTokenFromInstance({
	instance,
	size,
}: {
	instance: InstanceIdentity;
	size?: number;
}) {
	return (
		<FragmentToken
			pokemonId={instance.pokemon_id}
			isShiny={instance.is_shiny}
			size={size}
		/>
	);
}
