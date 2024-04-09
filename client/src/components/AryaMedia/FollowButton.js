"use client";
import Image from "next/image";
import { follow, unFollow } from "@/api/user/user";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect, useState } from "react";
import { mutate } from "swr";

export default function FollowButton({ idToFollow }) {
	const { user, setUser, uid } = useContext(AuthContext);
	const [isFollowing, setIsFollowing] = useState(false);

	async function handleFollow(e) {
		e.preventDefault();

		await follow(uid, idToFollow);

		setIsFollowing(true);
		mutate("login/success");
	}
	async function handleUnfollow(e) {
		e.preventDefault();

		await unFollow(uid, idToFollow);
		setIsFollowing(false);
		mutate("login/success");
	}
	// const isFollowingg = user?.following?.includes(idToFollow);
	console.log(user);

	return (
		<div>
			<>
				{!isFollowing ? (
					<Image
						onClick={handleFollow}
						src={"./images/icons/check_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						style={{
							filter:
								"invert(19%) sepia(98%) saturate(2685%) hue-rotate(258deg) brightness(91%) contrast(97%)",
						}}
					/>
				) : (
					<Image
						onClick={handleUnfollow}
						src={"./images/icons/uncheck_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						style={{
							filter:
								"invert(17%) sepia(87%) saturate(7481%) hue-rotate(359deg) brightness(100%) contrast(115%)",
						}}
					/>
				)}
			</>
		</div>
	);
}
