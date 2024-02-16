"use client";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/libs/users/user";
export default function AppLayout({ children }) {
	const [uid, setUid] = useState(null);
	const [user, setUser] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchSession() {
			try {
				const session = await getSession();

				if (session?.userId) {
					setUid(session?.userId);

					console.log("Mise à jour de l'UID");
				} else {
					setUid(null);
				}
			} catch (err) {
				console.log("Erreur lors de la récupération de la session:", err);
				setError("Une erreur s'est produite lors de l'authentification");
			}
		}

		fetchSession();

		if (uid) {
			// Fetch user
			async function fetchUser() {
				const user = await getUser(uid);
				setUser({ ...user });
			}

			fetchUser();
		}

		const interval = setInterval(fetchSession, 13 * 60 * 1000);

		return () => clearInterval(interval);
	}, [uid, error]);
	return (
		<>
			<AuthContext.Provider value={{ uid, setUid, user, error }}>
				<Header />
				{children}
				<Footer />
			</AuthContext.Provider>
		</>
	);
}
