import { saveMessage } from "@/actions/message";
import { revalidateConversations } from "@/api/conversations/conversations";
import { montserrat } from "@/libs/fonts";
import socket from "@/libs/socket";
import styles from "@/styles/components/chat/chatFooter.module.css";
import {
	faEllipsisVertical,
	faFileSignature,
	faImage,
	faPaperclip,
	faPaperPlane,
	faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
	data: {},
	error: [],
};

export default function ChatFooter({ uid, conversationId, otherUserId }) {
	const saveMessageWithUid = saveMessage.bind(null, uid);
	const [state, formAction] = useFormState(saveMessageWithUid, initialState);
	const [more, setMore] = useState(false);
	const [text, setText] = useState("");
	const [files, setFiles] = useState([]);
	const [isFocus, setIsFocus] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const inputFile = useRef(null);

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
		setText(e.target.value);
	}

	function handleSendMessage(e) {
		if (e.target.value.length <= 0 && inputFile.current.files.length === 0) {
			return;
		}
		const message = {
			senderId: uid,
			conversationId: conversationId,
			content: e.target.value,
		};
		socket.emit("pending-message", message);
		socket.emit("typing", false);
		e.target.value = "";
		inputFile.current.value = "";
	}

	useEffect(() => {
		socket.on("latest-message", () => {
			revalidateConversations();
		});

		return () => {
			socket.off("latest-message");
		};
	}, [socket]);

	useEffect(() => {
		if (state.status === "success") {
			setFiles([]);
			setText("");
			socket.emit("private-message", state?.data, otherUserId);
			socket.emit("latest-message");
		}
	}, [state]);

	useEffect(() => {
		console.log(files[0]);
		if (text.length === 0 && files.length === 0) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [text, files]);
	return (
		<div className={styles.container}>
			<form action={formAction} id="send-message">
				<div className={styles.ellipsis}>
					<FontAwesomeIcon
						icon={faEllipsisVertical}
						onClick={(e) => setMore(!more)}
					/>
					{more && (
						<div className={styles.more}>
							<label htmlFor="img">
								<FontAwesomeIcon icon={faImage} />
							</label>
							<Image
								src="/images/icons/gif_icon.svg"
								width={20}
								height={20}
								alt="icon"
								className={styles.icon}
							/>
							<FontAwesomeIcon icon={faSmile} />
							<FontAwesomeIcon icon={faFileSignature} />
						</div>
					)}
					{/* {isFocus ? (
					
					) : (
						<>
							<label htmlFor="img">
								<FontAwesomeIcon icon={faImage} />
							</label>
							<Image
								src="/images/icons/gif_icon.svg"
								width={20}
								height={20}
								alt="icon"
								className={styles.icon}
							/>
							<FontAwesomeIcon icon={faSmile} />
						</>
					)} */}
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
						type="file"
						id="img"
						name="img"
						ref={inputFile}
						onChange={(e) => setFiles(e.target.files)}
						multiple
						hidden
					/>
					<input
						type="text"
						id="conversationId"
						name="conversationId"
						defaultValue={conversationId}
						hidden
					/>
				</div>
				<div className={styles.button}>
					<button data-disabled={isDisabled}>
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</div>
			</form>
		</div>
	);
}
