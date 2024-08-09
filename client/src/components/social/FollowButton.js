"use client";
import { follow } from "@/api/user/user";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import { mutate } from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function FollowButton({ idToFollow, limit }) {
	const { setUser, uid } = useContext(AuthContext);

	async function handleFollow(e) {
		e.preventDefault();
		await follow(uid, idToFollow);
		mutate("/login/success");
	}

	return (
		<>
			<FontAwesomeIcon
				icon={faUserPlus}
				title="Suivre cet utilisateur"
				onClick={handleFollow}
				style={{
					width: "25px",
					height: "25px",
					filter:
						"invert(19%) sepia(98%) saturate(2685%) hue-rotate(258deg) brightness(91%) contrast(97%)",
					cursor: "pointer",
				}}
			/>
		</>
	);
}
