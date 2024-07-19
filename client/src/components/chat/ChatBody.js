import { getMessages } from "@/api/conversations/message";
import socket from "@/libs/socket";
import { checkIfEmpty } from "@/libs/utils";
import styles from "@/styles/components/chat/chat.module.css";
import {
	faCircle,
	faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
export default function ChatBody({
	conversationId,
	uid,
	isTyping,
	setIsTyping,
}) {
	const conversationRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [displayOptions, setDisplayOptions] = useState(null);

	const getMessagesWithId = getMessages.bind(null, conversationId);
	const { data } = useSWR(`/messages/${getMessagesWithId}`, getMessagesWithId, {
		onSuccess: (data) => {
			setMessages(data);
		},
		revalidateOnFocus: false,
		revalidateOnMount: true,
	});

	// useEffect(() => {
	// 	if (data) {
	// 		setMessages(data);
	// 	}
	// }, [data]);

	useEffect(() => {
		socket?.on("is-typing", (boolean, conversationId) => {
			setIsTyping({
				...isTyping,
				boolean: boolean,
				conversationId: conversationId,
			});
		});
		socket?.on("receive-message", (data) => {
			console.log("socket", data);
			setMessages((prevState) => [...prevState, data]);
		});

		return () => {
			socket.off("is-typing");
			socket.off("receive-message");
		};
	}, [socket]);
	const scrollToBottom = () => {
		if (conversationRef.current) {
			conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isTyping]);

	return (
		<div
			className={styles.conversation}
			id="conversation"
			ref={conversationRef}>
			{!checkIfEmpty(messages) &&
				messages?.map((message) => {
					if (message.conversationId === conversationId) {
						return (
							<div
								data-self={message?.senderId === uid}
								className={styles.message}
								key={message._id}
								onMouseEnter={(e) => setDisplayOptions(message._id)}
								onMouseLeave={(e) => setDisplayOptions(null)}>
								{displayOptions === message._id && (
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
								)}
								<div className={styles.content}>
									<p>{message?.content}</p>
								</div>
							</div>
						);
					}
				})}
			{isTyping.boolean === true &&
				isTyping.conversationId === conversationId && (
					<div className={styles.typing}>
						<FontAwesomeIcon icon={faCircle} />
						<FontAwesomeIcon icon={faCircle} />
						<FontAwesomeIcon icon={faCircle} />
					</div>
				)}
		</div>
	);
}
