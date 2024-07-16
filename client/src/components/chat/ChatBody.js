import { getMessages } from "@/api/conversations/message";
import socket from "@/libs/socket";
import { checkIfEmpty } from "@/libs/utils";
import styles from "@/styles/components/chat/chat.module.css";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
export default function ChatBody({ conversationId, uid }) {
	const [messages, setMessages] = useState([]);

	const getMessagesWithId = getMessages.bind(null, conversationId);
	const messagesData = useSWR(
		`/messages/${getMessagesWithId}`,
		getMessagesWithId,
		{
			onSuccess: (data) => {
				setMessages(data);
			},
		}
	);

	useEffect(() => {
		socket?.on("receive-message", (data) => {
			console.log("socket", data);
			setMessages((prevState) => [...prevState, data]);
		});

		return () => {
			socket.off("receive-message");
		};
	}, [socket]);

	return (
		<div className={styles.conversation} id="conversation">
			{!checkIfEmpty(messages) &&
				messages?.map((message) => {
					return (
						<div
							data-self={message?.senderId === uid}
							className={styles.message}
							key={message._id}>
							<div className={styles.options}>
								<Image
									src={"/images/icons/addReaction_icon.svg"}
									alt="icon"
									width={25}
									height={25}
									id="icon"
								/>
								{message?.senderId === uid && (
									<FontAwesomeIcon icon={faEllipsisVertical} />
								)}
							</div>
							<div className={styles.content}>
								<p>{message?.content}</p>
							</div>
						</div>
					);
				})}
		</div>
	);
}
