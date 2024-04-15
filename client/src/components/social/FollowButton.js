"use client";
import Image from "next/image";
import { follow } from "@/api/user/user";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import { mutate } from "swr";

export default function FollowButton({ idToFollow, limit }) {
	const { user, setUser, uid } = useContext(AuthContext);

	async function handleFollow(e) {
		e.preventDefault();
		await follow(uid, idToFollow);
		mutate("/login/success");
	}

	return (
		<>
			<Image
				onClick={handleFollow}
				src={"./images/icons/check_icon.svg"}
				alt="icon"
				width={25}
				height={25}
				style={{
					filter:
						"invert(19%) sepia(98%) saturate(2685%) hue-rotate(258deg) brightness(91%) contrast(97%)",
					cursor: "pointer",
				}}
			/>
		</>
	);
}
