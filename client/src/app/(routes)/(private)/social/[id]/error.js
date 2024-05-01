"use client"; // Error components must be Client Components

"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div>
			<span>Cette publication n'existe pas ou plus</span>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}>
				Retourner au fil d'actualité
			</button>
		</div>
	);
}
