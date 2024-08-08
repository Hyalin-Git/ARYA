import { addToRead, getMessages } from "@/api/conversations/message";
import socket from "@/libs/socket";
import { checkIfEmpty, extractURL, hasReacted } from "@/libs/utils";
import styles from "@/styles/components/chat/chat.module.css";
import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Messages from "./Messages";
import { montserrat } from "@/libs/fonts";

export default function ChatBody({
	conversation,
	conversationId,
	uid,
	otherUserId,
	isTyping,
	setIsTyping,
}) {
	const conversationRef = useRef(null);
	const [messages, setMessages] = useState([]);

	const [pendingMessages, setPendingMessages] = useState([]);

	const getMessagesWithId = getMessages.bind(null, conversationId);
	const { data, isLoading, isValidating } = useSWR(
		`/messages?conversationId=${conversationId}`,
		getMessagesWithId
	);

	useEffect(() => {
		socket?.on("is-typing", (boolean, conversationId) => {
			setIsTyping({
				...isTyping,
				boolean: boolean,
				conversationId: conversationId,
			});
		});
		socket?.on("pending-message", (res) => {
			setPendingMessages((prev) => [...prev, res]);
		});
		socket.on("receive-message", (res) => {
			// When we receive a new message, we revalidate the conversation
			if (!res.readBy.includes(uid) && res.conversationId === conversationId) {
				res.readBy.push(uid); // Push the id in readBy array for an instant response
				addToRead(res?._id, uid); // Save the modification in the DB
			}
			if (messages.length > 0) {
				setMessages((prev) => [...prev, res]);
			} else {
				setMessages([res]);
			}

			if (pendingMessages.length > 0) {
				setPendingMessages((prev) => prev.slice(1));
			}
		});

		socket.on("updated-message", (res) => {
			const updatedMessage = messages.find(
				(message) => message._id === res._id
			);
			updatedMessage.isEdited = true;
			updatedMessage.content = res?.content;
		});

		socket.on("added-message-reaction", (res) => {
			setMessages((prevMessages) => {
				// Trouver l'index du message correspondant à res._id
				const index = prevMessages.findIndex(
					(message) => message._id === res._id
				);

				if (index !== -1) {
					// Créer une nouvelle copie du tableau de messages
					const updatedMessages = [...prevMessages];

					// Remplacer le message à l'index trouvé par res
					updatedMessages[index] = res;

					return updatedMessages;
				}

				// Si le message n'existe pas, retourner le tableau de messages précédent inchangé
				return prevMessages;
			});
		});

		socket.on("deleted-message-reaction", (res) => {
			setMessages((prevMessages) => {
				// Trouver l'index du message correspondant à res._id
				const index = prevMessages.findIndex(
					(message) => message._id === res._id
				);

				if (index !== -1) {
					// Créer une nouvelle copie du tableau de messages
					const updatedMessages = [...prevMessages];

					// Remplacer le message à l'index trouvé par res
					updatedMessages[index] = res;

					return updatedMessages;
				}

				// Si le message n'existe pas, retourner le tableau de messages précédent inchangé
				return prevMessages;
			});
		});

		socket.on("deleted-message", (res) => {
			setMessages((prevMessages) =>
				prevMessages.filter((message) => message._id !== res._id)
			);
		});

		return () => {
			socket.off("is-typing");
			socket.off("updated-message");
			socket.off("added-message-reaction");
			socket.off("deleted-message");
			socket.off("pending-message");
			socket.off("receive-message");
		};
	}, [socket, messages, pendingMessages]);

	const scrollToBottom = () => {
		if (conversationRef.current) {
			conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, pendingMessages]);

	useEffect(() => {
		if (data) {
			setMessages(data);
		}
		// Filter every unread message
		const unReadMessages = messages.filter(
			(message) => !message.readBy.includes(uid)
		);

		// then for each message who is not read, add the uid of the user in the readBy array
		for (const unReadMessage of unReadMessages) {
			addToRead(unReadMessage._id, uid);
		}
	}, [data]);

	return (
		<div
			className={styles.conversation}
			id="conversation"
			ref={conversationRef}>
			{isLoading ? (
				<div className={styles.loader}>
					<FontAwesomeIcon icon={faSpinner} />
				</div>
			) : (
				<>
					{!checkIfEmpty(messages) &&
						messages?.map((message, idx) => {
							if (message.conversationId === conversationId) {
								const nextMessage = messages[idx + 1];
								return (
									<Messages
										uid={uid}
										conversation={conversation}
										message={message}
										otherUserId={otherUserId}
										nextMessage={nextMessage}
										key={message._id}
									/>
								);
							}
						})}

					{!checkIfEmpty(pendingMessages) &&
						pendingMessages.map((pendingMessage, idx) => {
							if (pendingMessage.conversationId === conversationId) {
								return (
									<div
										data-self={pendingMessage?.senderId === uid}
										className={styles.message}
										key={idx}>
										<div className={styles.text} data-pending={true}>
											<pre className={montserrat.className}>
												{pendingMessage?.content}
											</pre>
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
				</>
			)}
		</div>
	);
}
