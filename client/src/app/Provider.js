"use client";
import { useContext, useEffect, useState } from "react";
import { getSession } from "@/api/user/auth";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/api/user/user";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { mutate } from "swr";
import Image from "next/image";
export default function Provider({ children }) {
	const [uid, setUid] = useState(null);
	const [user, setUser] = useState({});
	const pathname = usePathname();

	const { data, error, isLoading } = useSWR("/login/success", getSession, {
		onSuccess: async (data, key, config) => {
			setUid(data);
			const user = await getUser(data);
			setUser({ ...user });
		},
		refreshInterval: 10 * 60 * 1000,
		revalidateOnMount: true,
		revalidateOnFocus: true,
	});

	useEffect(() => {
		mutate("/login/success");
	}, [pathname]);

	return (
		<>
			<AuthContext.Provider value={{ uid, setUid, user, setUser, error }}>
				{isLoading ? (
					<div
						style={{
							position: "relative",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100vh",
						}}>
						<Image
							src={"/images/logo/Arya_Monochrome_Meteorite.png"}
							width={120}
							height={120}
							alt="icon"
						/>
					</div>
				) : (
					<>{children}</>
				)}
			</AuthContext.Provider>
		</>
	);
}

export const useMyContext = () => {
	return useContext(AuthContext);
};
