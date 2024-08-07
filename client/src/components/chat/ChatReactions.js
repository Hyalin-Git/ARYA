import { addReaction } from "@/api/conversations/message";
import socket from "@/libs/socket";
import styles from "@/styles/components/chat/chatReactions.module.css";
import Image from "next/image";

export default function ChatReactions({
	uid,
	conversationId,
	messageId,
	senderId,
	setDisplayReactions,
	otherUserId,
}) {
	async function handleReaction(e) {
		e.preventDefault();
		const reaction = e.target.id;

		// play the add reaction func
		console.log(reaction);
		const res = await addReaction(
			conversationId,
			messageId,
			senderId,
			uid,
			reaction
		);
		console.log(senderId, otherUserId);
		// Emit to socket
		if (res) {
			socket.emit("add-message-reaction", res, otherUserId);
		}

		// close this comp
		setDisplayReactions(false);
	}

	return (
		<div className={styles.container}>
			<Image
				src={"/images/icons/love_icon.svg"}
				alt="icon"
				width={25}
				height={25}
				id="love"
				onClick={handleReaction}
			/>
			<Image
				src={"/images/icons/funny_icon.svg"}
				alt="icon"
				width={25}
				height={25}
				id="funny"
				onClick={handleReaction}
			/>
			<Image
				src={"/images/icons/surprised_icon.svg"}
				alt="icon"
				width={25}
				height={25}
				id="surprised"
				onClick={handleReaction}
			/>
			<Image
				src={"/images/icons/sad_icon.svg"}
				alt="icon"
				width={25}
				height={25}
				id="sad"
				onClick={handleReaction}
			/>
		</div>
	);
}
