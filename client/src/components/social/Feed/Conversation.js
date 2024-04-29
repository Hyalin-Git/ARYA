"use client";
import { AuthContext } from "@/context/auth";

import styles from "@/styles/components/social/conversation.module.css";
import Image from "next/image";
import { useContext } from "react";

export default function Conversation({ conversation }) {
	const { uid } = useContext(AuthContext);
	const getOtherUser = conversation.users.find((user) => user._id !== uid);

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<div>
					<Image
						src={getOtherUser.picture || "/images/profil/default-pfp.jpg"}
						alt="picture"
						width={50}
						height={50}
						quality={100}
					/>
				</div>
				<div>
					<div>
						<span>
							{getOtherUser.firstName} {getOtherUser.lastName}
						</span>
						<br />
						<span>{getOtherUser.userName}</span>
					</div>
				</div>
			</div>
			<div className={styles.right}>
				<span>{conversation.latestMessage || "Démarrer une conversation"}</span>
			</div>
			<div className={styles.date}>
				<span>18 march</span>
			</div>
		</div>
	);
}
