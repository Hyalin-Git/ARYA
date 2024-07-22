import { saveMessage } from "@/actions/message";
import { revalidateConversations } from "@/api/conversations/conversations";
import { montserrat } from "@/libs/fonts";
import socket from "@/libs/socket";
import styles from "@/styles/components/chat/chat.module.css";
import {
	faEllipsisVertical,
	faImage,
	faPaperPlane,
	faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};

export default function ChatFooter({
	uid,
	conversationId,
	otherUserId,
	conversation,
	setIsTyping,
}) {
	const saveMessageWithUid = saveMessage.bind(null, uid);
	const [state, formAction] = useFormState(saveMessageWithUid, initialState);
	const [isFocus, setIsFocus] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	function handleTyping(e) {
		socket.emit("typing", true, conversationId);

		if (e.target.value <= 0) {
			socket.emit("typing", false, conversationId);
		}
		// let timeout;

		// clearTimeout(timeout);

		// timeout = setTimeout(() => {
		// 	socket.emit("typing", false);
		// }, 5000);
	}
	function handleTextOnChange(e) {
		e.preventDefault();
		handleTyping(e);
		e.target.style.height = "";
		e.target.style.height = e.target.scrollHeight + "px";

		if (e.target.value.length > 0) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}

	function handleSendMessage(e) {
		if (e.target.value.length <= 0) {
			return;
		}

		socket.emit("private-message", {
			conversationId: conversationId,
			receiverId: getOtherUserInfo._id,
			senderId: uid,
			content: e.target.value,
		});
		socket.emit("latest-message", {
			conversationId: conversationId,
			content: e.target.value,
		});
		socket.emit("typing", false);
		e.target.value = "";
	}

	useEffect(() => {
		socket.on("latest-message", () => {
			revalidateConversations();
		});

		return () => {
			socket.off("latest-message");
		};
	}, [socket]);

	// useEffect(() => {
	// 	if (state.status === "success") {
	// 		socket.on("latest-message", () => {
	// 			console.log("giga played");
	// 			revalidateConversations();
	// 		});
	// 	}
	// 	return () => {
	// 		socket.off("latest-message");
	// 	};
	// }, [state, socket]);
	return (
		<div className={styles.form}>
			<form action={formAction} id="send-message">
				<div className={styles.icons}>
					{isFocus ? (
						<FontAwesomeIcon icon={faEllipsisVertical} />
					) : (
						<>
							<label htmlFor="img">
								<FontAwesomeIcon icon={faImage} />
							</label>
							<input type="file" id="img" name="img" multiple hidden />
							<Image
								src="/images/icons/gif_icon.svg"
								width={20}
								height={20}
								alt="icon"
								className={styles.icon}
							/>
							<FontAwesomeIcon icon={faSmile} />
						</>
					)}
				</div>
				<div className={styles.input}>
					<textarea
						name="message"
						id="message"
						placeholder="Écrire un nouveau message"
						rows={1}
						className={montserrat.className}
						onFocus={(e) => setIsFocus(true)}
						onBlur={(e) => setIsFocus(false)}
						onChange={handleTextOnChange}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.shiftKey) {
							} else if (e.key === "Enter") {
								e.preventDefault();
								document.getElementById("send-message").requestSubmit();

								handleSendMessage(e);
							}
						}}></textarea>
					<input
						type="text"
						id="conversationId"
						name="conversationId"
						value={conversationId}
						hidden
					/>
				</div>
				<div className={styles.icons}>
					<button data-disabled={isDisabled}>
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</div>
			</form>
		</div>
	);
}
