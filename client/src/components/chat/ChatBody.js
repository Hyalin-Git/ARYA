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
	isTyping,
	setIsTyping,
}) {
	const conversationRef = useRef(null);
	const [displayOptions, setDisplayOptions] = useState(null);
	const [displayMessageOptions, setDisplayMessageOptions] = useState(false);
	const [edit, setEdit] = useState(null);

	const getMessagesWithId = getMessages.bind(null, conversationId);
	const { data } = useSWR(
		`/messages?conversationId=${conversationId}`,
		getMessagesWithId,
		{
			revalidateOnMount: true,
		}
	);
	function handleMessageOptions(e) {
		e.preventDefault();
		setDisplayMessageOptions(true);
	}

	async function handleDelete(message) {
		await deleteMessage(message?._id, uid);

		socket.emit("delete-message");
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
		socket?.on("receive-message", (res) => {
			// When we receive a new message, we revalidate the conversation
			mutate(`/messages?conversationId=${conversationId}`);
			// and add the uid into the readBy array in the message model
			addToRead(res?._id, uid);
		});

		socket.on("updated-message", () => {
			mutate(`/messages?conversationId=${conversationId}`);
		});

		socket.on("delete-message", () => {
			mutate(`/messages?conversationId=${conversationId}`);
		});

		return () => {
			socket.off("is-typing");
			socket.off("receive-message");
			// socket.off("latest-message");
		};
	}, [socket]);

	const scrollToBottom = () => {
		if (conversationRef.current) {
			conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [data, isTyping]);

	return (
		<div
			className={styles.conversation}
			id="conversation"
			ref={conversationRef}>
			{!checkIfEmpty(data) &&
				data?.map((message, idx) => {
					if (message.conversationId === conversationId) {
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
															Modifier <FontAwesomeIcon icon={faPenToSquare} />
														</span>
														<span>
															Copier <FontAwesomeIcon icon={faCopy} />
														</span>
														<span
															onClick={(e) => {
																handleDelete(message);
															}}>
															Supprimer <FontAwesomeIcon icon={faTrashCan} />
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
									/>
								) : (
									<>
										<div className={styles.content}>
											<p>{message?.content}</p>
											<div>
												{message?.isEdited ? (
													<span>Modifié {displayUpdatedAt(message)}</span>
												) : (
													<span>{displayCreatedAt(message)}</span>
												)}
											</div>
										</div>
									</>
								)}
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
