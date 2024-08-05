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
import { deleteMessage } from "@/api/conversations/message";
import socket from "@/libs/socket";
import { checkIfEmpty, extractURL } from "@/libs/utils";
import { montserrat } from "@/libs/fonts";

export default function ({ uid, nextMessage, message, otherUserId }) {
	const [messageWithLink, setMessageWithLink] = useState("");
	const [displayOptions, setDisplayOptions] = useState(false);
	const [displayMessageOptions, setDisplayMessageOptions] = useState(false);
	const [edit, setEdit] = useState(false);

	const hasVideo = extractURL(message?.content);

	const isAuthor = message?.senderId === uid;
	const hasMedias = message.media.length > 0;
	const displayDate =
		!nextMessage ||
		!moment(message.createdAt).isSame(nextMessage.createdAt, "minute");

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
						onMouseEnter={(e) => setDisplayOptions(true)}
						onMouseLeave={(e) => {
							setDisplayOptions(false);
							setDisplayMessageOptions(false);
						}}>
						{displayOptions && !displayMessageOptions && (
							<div className={styles.options}>
								<Image
									src={"/images/icons/addReaction_icon.svg"}
									alt="icon"
									width={25}
									height={25}
									id="icon"
								/>
								{isAuthor && (
									<FontAwesomeIcon
										icon={faEllipsisVertical}
										onClick={handleMessageOptions}
									/>
								)}
							</div>
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
						<div className={styles.text}>
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
