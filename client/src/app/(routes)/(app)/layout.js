"use client";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth";
import { AuthContext } from "@/context/auth";

export default function AppLayout({ children }) {
	const [uid, setUid] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchSession() {
			try {
				const session = await getSession();
				setUid(session?.userId);
			} catch (err) {
				console.log("Erreur lors de la récupération de la session:", err);
				setError("Une erreur s'est produite lors de l'authentification");
			}
		}
		fetchSession();
	}, []);
	return (
		<>
			<AuthContext.Provider value={{ uid, error }}>
				<Header />
				{children}
				<Footer />
			</AuthContext.Provider>
		</>
	);
}
