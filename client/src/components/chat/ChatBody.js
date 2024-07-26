import {
	addToRead,
	deleteMessage,
	getMessages,
} from "@/api/conversations/message";
import socket from "@/libs/socket";
import { checkIfEmpty, formattedDate } from "@/libs/utils";
import styles from "@/styles/components/chat/chat.module.css";
import {
	faCircle,
	faCopy,
	faEllipsisVertical,
	faPenToSquare,
	faSpinner,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import UpdateMessage from "./UpdateMessage";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work

export default function ChatBody({
	latestMessage,
	conversationId,
	uid,
	otherUserId,
	isTyping,
	setIsTyping,
}) {
	const conversationRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [pendingMessages, setPendingMessages] = useState([]);
	const [displayOptions, setDisplayOptions] = useState(null);
	const [displayMessageOptions, setDisplayMessageOptions] = useState(false);
	const [edit, setEdit] = useState(null);

	const getMessagesWithId = getMessages.bind(null, conversationId);
	const { data, isLoading, isValidating } = useSWR(
		`/messages?conversationId=${conversationId}`,
		getMessagesWithId
	);

	function handleMessageOptions(e) {
		e.preventDefault();
		setDisplayMessageOptions(true);
	}

	async function handleDelete(message) {
		const deletedMessage = await deleteMessage(message?._id, uid);

		socket.emit("delete-message", deletedMessage, otherUserId);
		setDisplayMessageOptions(false);
	}

	function displayCreatedAt(message) {
		return moment(message?.createdAt).locale("fr").format("ll LT");
	}
	function displayUpdatedAt(message) {
		return moment(message?.updatedAt).locale("fr").format("ll LT");
	}

	useEffect(() => {
		socket?.on("is-typing", (boolean, conversationId) => {
			setIsTyping({
				...isTyping,
				boolean: boolean,
				conversationId: conversationId,
			});
		});
		socket?.on("pending-message", (res) => {
			console.log(res, "pending");
			setPendingMessages((prev) => [...prev, res]);
		});
		socket.on("receive-message", (res) => {
			// When we receive a new message, we revalidate the conversation
			if (!res.readBy.includes(uid) && res.conversationId === conversationId) {
				res.readBy.push(uid); // Push the id in readBy array for an instant response
				addToRead(res?._id, uid); // Save the modification in the DB
			}
			setMessages((prev) => [...prev, res]);

			if (pendingMessages.length > 0) {
				setPendingMessages((prev) => prev.slice(1));
			}

			// and add the uid into the readBy array in the message model
		});

		socket.on("updated-message", (res) => {
			const updatedMessage = messages.find(
				(message) => message._id === res._id
			);
			updatedMessage.content = res?.content;
		});

		socket.on("deleted-message", (res) => {
			setMessages((prevMessages) =>
				prevMessages.filter((message) => message._id !== res._id)
			);
		});

		return () => {
			socket.off("is-typing");
			socket.off("updated-message");
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
	}, [messages, pendingMessages, isTyping]);

	useEffect(() => {
		if (data) {
			setMessages(data);
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
								const displayDate =
									!nextMessage ||
									!moment(message.createdAt).isSame(
										nextMessage.createdAt,
										"minute"
									);

								return (
									<div
										data-self={message?.senderId === uid}
										className={styles.message}
										key={message._id || idx}
										onMouseEnter={(e) => setDisplayOptions(message._id)}
										onMouseLeave={(e) => {
											setDisplayOptions(null);
											setDisplayMessageOptions(false);
										}}>
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
													<div className={styles.more}>
														<FontAwesomeIcon
															icon={faEllipsisVertical}
															onClick={handleMessageOptions}
														/>
														{displayMessageOptions && (
															<div className={styles.popup}>
																<span
																	onClick={(e) => {
																		setDisplayMessageOptions(false);
																		setEdit(message?._id);
																	}}>
																	Modifier{" "}
																	<FontAwesomeIcon icon={faPenToSquare} />
																</span>
																<span>
																	Copier <FontAwesomeIcon icon={faCopy} />
																</span>
																<span
																	onClick={(e) => {
																		handleDelete(message);
																	}}>
																	Supprimer{" "}
																	<FontAwesomeIcon icon={faTrashCan} />
																</span>
															</div>
														)}
													</div>
												)}
											</div>
										)}
										{edit === message?._id ? (
											<UpdateMessage
												conversationId={conversationId}
												message={message}
												setEdit={setEdit}
												uid={uid}
												otherUserId={otherUserId}
											/>
										) : (
											<div className={styles.content}>
												<div className={styles.text}>
													<p>{message?.content}</p>
												</div>
												<div className={styles.date}>
													{message?.isEdited ? (
														<span>Modifié {displayUpdatedAt(message)}</span>
													) : (
														<>
															{displayDate && (
																<span>{displayCreatedAt(message)}</span>
															)}
														</>
													)}
												</div>
											</div>
										)}
									</div>
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
											<p>{pendingMessage?.content}</p>
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
