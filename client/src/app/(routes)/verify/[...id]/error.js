"use client"; // Error components must be Client Components

import { useEffect } from "react";
import NotFound from "./not-found";

export default function Error({ error, reset }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	if (
		error.message.includes("Aucun utilisateur trouvé") ||
		error.message.includes("Lien invalide")
	) {
		return NotFound();
	}

	return (
		<div>
			<h2>Oops ! On dirait bien qu'un problème est survenu</h2>
			<p>{error.message}</p>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}>
				Essayer à nouveau
			</button>
		</div>
	);
}
