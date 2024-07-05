"use client";
import { AuthContext } from "@/context/auth";

import styles from "@/styles/components/social/conversations/conversations.module.css";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
import Image from "next/image";
import { useContext } from "react";

export default function Conversations({
	conversation,
	setOpenedConv,
	setOtherUserId,
}) {
	const { uid } = useContext(AuthContext);
	const getOtherUser = conversation.users.find((user) => user._id !== uid);
	const date = moment(conversation?.updatedAt).format("Do MMMM");
	const year = moment(conversation?.updatedAt).format("YYYY");

	function openSelectedConv(e) {
		e.preventDefault();
		setOpenedConv(conversation._id);
		setOtherUserId(getOtherUser?._id);
	}

	return (
		<div className={styles.container} onClick={openSelectedConv}>
			<div className={styles.picture}>
				<Image
					src={getOtherUser?.picture || "/images/profil/default-pfp.jpg"}
					alt="picture"
					width={50}
					height={50}
					quality={100}
				/>
			</div>
			<div className={styles.conversation}>
				<div className={styles.names}>
					<span>{getOtherUser?.firstName + " " + getOtherUser?.lastName}</span>
					<span>{getOtherUser?.userName}</span>
				</div>
				<div className={styles.latestMessage}>
					<span>
						{conversation.latestMessage || "Démarrer une conversation"}
					</span>
				</div>
			</div>
			<div className={styles.date}>
				<span>{date}</span>
				<span>{year}</span>
			</div>
		</div>
	);
}
