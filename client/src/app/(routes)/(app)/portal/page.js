"use client";
import { logout } from "@/actions/auth";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";

export default function Portal() {
	const { uid, setUid, user } = useContext(AuthContext);
	return (
		<div>
			<p>{uid ? user.firstName : "not connected"}</p>
			<button
				onClick={async () => {
					setUid(null);
					logout();
				}}></button>
		</div>
	);
}
