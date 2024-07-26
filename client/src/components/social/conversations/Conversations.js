"use client";
import { revalidateConversations } from "@/api/conversations/conversations";
import { AuthContext } from "@/context/auth";
import socket from "@/libs/socket";
import styles from "@/styles/components/social/conversations/conversations.module.css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

export default function Conversations({
	conversation,
	setOpenedConv,
	setOtherUserId,
}) {
	const { uid } = useContext(AuthContext);
	const getOtherUser = conversation.users.find((user) => user._id !== uid);
	const date = moment(conversation?.updatedAt).format("Do MMMM");
	const year = moment(conversation?.updatedAt).format("YYYY");

	const hasRead = conversation?.latestMessage?.readBy?.some(
		(userId) => userId === uid
	);

	function openSelectedConv(e) {
		e.preventDefault();
		setOpenedConv(conversation._id);
		setOtherUserId(getOtherUser?._id);
	}

	useEffect(() => {
		socket.on("latest-message", () => {
			revalidateConversations();
		});
		socket.on("deleted-message", () => {
			revalidateConversations();
		});
		socket.on("logged-user", () => {
			revalidateConversations();
		});
		socket.on("disconnected-user", () => {
			revalidateConversations();
		});

		return () => {
			// socket.off("latest-message");
			socket.off("logged-user");
			socket.off("disconnected-user");
		};
	}, [socket]);

	console.log(hasRead);

	return (
		<div
			className={styles.container}
			data-read={hasRead}
			onClick={openSelectedConv}>
			<div className={styles.picture}>
				<Image
					src={getOtherUser?.picture || "/images/profil/default-pfp.jpg"}
					alt="picture"
					width={50}
					height={50}
					quality={100}
				/>

				<FontAwesomeIcon
					data-connected={getOtherUser?.status?.isConnected}
					className={styles.connectivity}
					icon={faCircle}
				/>
			</div>
			<div className={styles.conversation}>
				<div className={styles.names}>
					<span>{getOtherUser?.firstName + " " + getOtherUser?.lastName}</span>
					<span>{getOtherUser?.userName}</span>
				</div>
				<div className={styles.latestMessage}>
					<span>
						{hasRead === false && "Nouveau message : "}
						{conversation?.latestMessage?.content ||
							"Démarrer une conversation"}
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
