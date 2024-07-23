"use client";

import { getConversations } from "@/api/conversations/conversations";
import Chat from "@/components/chat/Chat";
import Conversations from "@/components/social/conversations/Conversations";
import { AuthContext } from "@/context/auth";
import socket from "@/libs/socket";
import styles from "@/styles/layouts/social/aside/conversationPanel.module.css";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

export default function ConversationPanel({ conversations }) {
	const { uid } = useContext(AuthContext);
	const [display, setDisplay] = useState(false);
	const [newMessage, setNewMessage] = useState(0);
	const [openedConv, setOpenedConv] = useState(null);
	const [otherUserId, setOtherUserId] = useState(null);
	const notFound = conversations?.message?.includes(
		"Aucune conversations n'a été trouvé"
	);

	const isOpenedConv = openedConv === null ? false : true;

	useEffect(() => {
		if (!conversations?.error) {
			const count = conversations.filter(
				(conversation) =>
					conversation.latestMessage &&
					!conversation.latestMessage.readBy.includes(uid)
			).length;
			console.log(count);

			setNewMessage(count);
		}
	}, [conversations]);

	console.log(conversations, "from panel");

	return (
		<div className={styles.container}>
			<div
				className={styles.header}
				onClick={(e) => {
					e.preventDefault();
					setDisplay(!display);
				}}>
				<span>Messagerie {newMessage !== 0 && `(${newMessage})`}</span>
				{display ? (
					<FontAwesomeIcon icon={faAngleUp} />
				) : (
					<FontAwesomeIcon icon={faAngleDown} />
				)}
			</div>
			<div className={styles.content} data-display={display}>
				{notFound ? (
					<div className={styles.empty}>
						<Image
							src={"/images/illustrations/no-message.png"}
							alt="illustration"
							width={200}
							height={200}
						/>
						<span>Aucun message ?</span>
						<p>C'est pas grâve ça va venir</p>
					</div>
				) : (
					<>
						{isOpenedConv ? (
							<Chat
								conversationId={openedConv}
								setOpenedConv={setOpenedConv}
								otherUserId={otherUserId}
								setOtherUserId={setOtherUserId}
							/>
						) : (
							<>
								{conversations?.map((conversation) => {
									return (
										<Conversations
											conversation={conversation}
											setOpenedConv={setOpenedConv}
											setOtherUserId={setOtherUserId}
											key={conversation._id}
										/>
									);
								})}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
