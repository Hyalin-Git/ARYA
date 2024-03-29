"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/api/user/auth";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/api/user/user";
import { usePathname, useRouter } from "next/navigation";

export default function Provider({ children }) {
	const [uid, setUid] = useState(null);
	const [user, setUser] = useState({});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		async function fetchSession() {
			try {
				const session = await getSession();
				console.log("played");
				if (session?.userId) {
					setUid(session?.userId);
					setIsLoading(false);
					// router.push("/");
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

		fetchSession();

		if (uid) {
			// Fetch user
			async function fetchUser() {
				const user = await getUser(uid);
				setUser({ ...user });
				setIsLoading(false);
			}

			fetchUser();
		}

		const interval = setInterval(fetchSession, 10 * 60 * 1000);

		return () => clearInterval(interval);
	}, [uid, pathname, error]);

	return (
		<>
			<AuthContext.Provider value={{ isLoading, uid, setUid, user, error }}>
				{children}
			</AuthContext.Provider>
		</>
	);
}
