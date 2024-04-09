"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/api/user/auth";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/api/user/user";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { mutate } from "swr";

export default function Provider({ children }) {
	const [uid, setUid] = useState(null);
	const [user, setUser] = useState({});
	const pathname = usePathname();

	const { data, error, isLoading } = useSWR("/login/success", getSession, {
		onSuccess: async (data, key, config) => {
			setUid(data?.userId);
			const user = await getUser(data?.userId);
			setUser({ ...user });
		},
		refreshInterval: 10 * 60 * 1000,
		revalidateOnMount: true,
	});

	useEffect(() => {
		mutate("/login/success");
	}, [pathname]);
	console.log(user);

	return (
		<>
			<AuthContext.Provider value={{ uid, setUid, user, setUser, error }}>
				{isLoading ? <div>loading</div> : <>{children}</>}
			</AuthContext.Provider>
		</>
	);
}
