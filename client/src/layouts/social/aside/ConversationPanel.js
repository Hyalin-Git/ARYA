"use client";

import Chat from "@/components/chat/Chat";
import Conversations from "@/components/social/conversations/Conversations";
import styles from "@/styles/layouts/social/aside/conversationPanel.module.css";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function ConversationPanel({ conversations }) {
	const [display, setDisplay] = useState(false);
	const [openedConv, setOpenedConv] = useState(null);
	const [otherUserId, setOtherUserId] = useState(null);
	const notFound = conversations?.message?.includes(
		"Aucune conversations n'a été trouvé"
	);

	const isOpenedConv = openedConv === null ? false : true;

	return (
		<div className={styles.container}>
			<div
				className={styles.header}
				onClick={(e) => {
					e.preventDefault();
					setDisplay(!display);
				}}>
				<span>Messagerie </span>
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
