"use client";
import { Suspense, useEffect, useState } from "react";
import { getSession } from "@/actions/auth";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/api/user/user";
import Header from "@/layouts/Header";
import Loading from "./loading";
import { HeaderUser } from "@/libs/skeletons";
export default function PrivateLayout({ children }) {
	const [uid, setUid] = useState(null);
	const [user, setUser] = useState({});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchSession() {
			try {
				const session = await getSession();

				if (session?.userId) {
					setUid(session?.userId);
					setIsLoading(false);
					console.log("Mise à jour de l'UID");
				} else {
					setUid(null);
					setIsLoading(false);
				}
			} catch (err) {
				console.log("Erreur lors de la récupération de la session:", err);
				setError("Une erreur s'est produite lors de l'authentification");
				setIsLoading(false);
			}
		}

		console.log("played");

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

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<AuthContext.Provider value={{ uid, setUid, user, error }}>
				<Header />
				{children}
			</AuthContext.Provider>
		</>
	);
}
