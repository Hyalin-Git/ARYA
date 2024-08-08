import styles from "@/styles/components/chat/message.module.css";
import {
	faCopy,
	faEllipsisVertical,
	faPenToSquare,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import UpdateMessage from "./UpdateMessage";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
import { deleteMessage, deleteReaction } from "@/api/conversations/message";
import socket from "@/libs/socket";
import {
	checkIfEmpty,
	extractURL,
	findUidReaction,
	hasReacted,
} from "@/libs/utils";
import { montserrat } from "@/libs/fonts";
import ChatReactions from "./ChatReactions";

export default function ({
	uid,
	conversation,
	nextMessage,
	message,
	otherUserId,
}) {
	const [messageWithLink, setMessageWithLink] = useState("");
	const [displayReactions, setDisplayReactions] = useState(false);
	const [displayOptions, setDisplayOptions] = useState(false);
	const [displayMessageOptions, setDisplayMessageOptions] = useState(false);

	const [edit, setEdit] = useState(false);
	const isAuthor = message?.senderId === uid;
	const hasReaction =
		hasReacted(message?.reactions, uid) ||
		hasReacted(message?.reactions, otherUserId);
	const AuthUserReaction = findUidReaction(message?.reactions, uid);
	const otherUserReaction = findUidReaction(message?.reactions, otherUserId);
	const hasVideo = extractURL(message?.content);
	const hasMedias = message.media.length > 0;
	const hasGif = message?.gif;

	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	const displayDate =
		!nextMessage ||
		!moment(message.createdAt).isSame(nextMessage.createdAt, "minute");

	function handleReactionDisplay(e) {
		e.preventDefault();
		setDisplayReactions(true);
	}

	function handleMessageOptions(e) {
		e.preventDefault();
		setDisplayMessageOptions(true);
	}

	async function handleDeleteReaction(e) {
		e.preventDefault();
		// Call the delete function
		const conversationId = message?.conversationId;
		const senderId = message?.senderId;
		const messageId = message?._id;
		const res = await deleteReaction(conversationId, senderId, messageId, uid);
		// Emit with socket
		if (res) {
			socket.emit("delete-message-reaction", res, uid, otherUserId);
		}
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
		let msg = message?.content;
		if (hasVideo.length > 0) {
			for (let index = 0; index < hasVideo.length; index++) {
				const element = hasVideo[index];

				const modifiedLink = `<a href=${element} target="_blank">${element}</a>`;
				msg = msg.replace(element, modifiedLink);
			}
			setMessageWithLink(msg);
		}
	}, [message?.content]);

	return (
		<div data-self={isAuthor} className={styles.container} key={message._id}>
			{!edit ? (
				<>
					<div
						className={styles.message}
						onMouseLeave={(e) => {
							setDisplayOptions(false);
							setDisplayMessageOptions(false);
							setDisplayReactions(false);
						}}>
						{!displayOptions && hasReaction && (
							<div className={styles.reaction}>
								{AuthUserReaction && (
									<div onClick={handleDeleteReaction}>
										<Image
											src={`/images/icons/${AuthUserReaction}_icon.svg`}
											alt="icon"
											width={20}
											height={20}
										/>
									</div>
								)}
								{otherUserReaction && (
									<div>
										<Image
											src={`/images/icons/${otherUserReaction}_icon.svg`}
											alt="icon"
											width={20}
											height={20}
										/>
										{/* display the counter if it's a group  */}
										{/* <span>{message?.reactions[otherUserReaction].length}</span> */}
									</div>
								)}
							</div>
						)}
						{displayOptions && !displayMessageOptions && !displayReactions && (
							<div className={styles.options}>
								{!isAuthor && (
									<Image
										src={"/images/icons/addReaction_icon.svg"}
										alt="icon"
										width={25}
										height={25}
										id="icon"
										onClick={handleReactionDisplay}
									/>
								)}
								{isAuthor && (
									<FontAwesomeIcon
										icon={faEllipsisVertical}
										onClick={handleMessageOptions}
									/>
								)}
							</div>
						)}
						{displayReactions && (
							<ChatReactions
								uid={uid}
								conversationId={message?.conversationId}
								messageId={message?._id}
								senderId={message?.senderId}
								setDisplayReactions={setDisplayReactions}
								otherUserId={uid}
							/>
						)}
						{displayMessageOptions && (
							<div className={styles.messageOptions}>
								<span
									onClick={(e) => {
										setDisplayMessageOptions(false);
										setEdit(true);
									}}>
									<FontAwesomeIcon icon={faPenToSquare} />
								</span>
								<span>
									<FontAwesomeIcon icon={faCopy} />
								</span>
								<span
									onClick={(e) => {
										handleDelete(message);
									}}>
									<FontAwesomeIcon icon={faTrashCan} />
								</span>
							</div>
						)}
						<div
							className={styles.text}
							onMouseEnter={(e) => setDisplayOptions(true)}>
							{messageWithLink ? (
								<pre
									className={montserrat.className}
									dangerouslySetInnerHTML={{ __html: messageWithLink }}></pre>
							) : (
								<pre className={montserrat.className}>{message?.content}</pre>
							)}
							{!checkIfEmpty(hasVideo) &&
								hasVideo.map((vid, idx) => {
									return <iframe src={vid} frameBorder={0} key={idx}></iframe>;
								})}
							{hasMedias && (
								<div>
									{message.media.map((img, idx) => {
										return (
											<Image
												className={styles.media}
												src={img}
												alt="media"
												width={0}
												height={0}
												sizes="100vw"
												quality={100}
												key={idx}
											/>
										);
									})}
								</div>
							)}
							{hasGif && (
								<div>
									<Image
										className={styles.gif}
										src={message?.gif}
										alt="media"
										width={0}
										height={0}
										sizes="100vw"
										quality={100}
									/>
								</div>
							)}
						</div>
					</div>

					<div className={styles.dates}>
						{message?.isEdited ? (
							<span>Modifié {displayUpdatedAt(message)}</span>
						) : (
							<>
								{displayDate && (
									<span className={styles.createdAt}>
										{displayCreatedAt(message)}
									</span>
								)}
							</>
						)}
					</div>
				</>
			) : (
				<UpdateMessage
					message={message}
					setEdit={setEdit}
					uid={uid}
					otherUserId={otherUserId}
				/>
			)}
		</div>
	);
}
