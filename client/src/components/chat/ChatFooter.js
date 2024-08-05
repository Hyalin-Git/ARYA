import { saveMessage } from "@/actions/message";
import { revalidateConversations } from "@/api/conversations/conversations";
import { montserrat } from "@/libs/fonts";
import socket from "@/libs/socket";
import { checkIfEmpty } from "@/libs/utils";
import styles from "@/styles/components/chat/chatFooter.module.css";
import {
	faEllipsisVertical,
	faFileSignature,
	faImage,
	faPaperclip,
	faPaperPlane,
	faRemove,
	faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useDebouncedCallback } from "use-debounce";

const initialState = {
	status: "pending",
	message: "",
	data: {},
	error: [],
};

export default function ChatFooter({ uid, conversationId, otherUserId }) {
	const [more, setMore] = useState(false);
	const [text, setText] = useState("");
	const [files, setFiles] = useState([]);
	const [isFocus, setIsFocus] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const inputFile = useRef(null);
	const saveMessageWithUid = saveMessage.bind(null, uid);
	const [state, formAction] = useFormState(saveMessageWithUid, initialState);

	function handleTyping(e) {
		socket.emit("typing", true, conversationId);

		if (e.target.value <= 0) {
			socket.emit("typing", false, conversationId);
		}
	}

	const debounced = useDebouncedCallback(() => {
		socket.emit("typing", false);
	}, 5000);

	function handleTextOnChange(e) {
		e.preventDefault();
		handleTyping(e);

		setIsDisabled(false);
		e.target.style.height = "";
		e.target.style.height = e.target.scrollHeight + "px";

		if (e.target.scrollHeight > 100) {
			e.target.style.overflowY = "scroll";
		} else {
			e.target.style.overflow = "hidden";
		}

		setText(e.target.value);

		if (e.target.value.length <= 0 && files.length <= 0) {
			setIsDisabled(true);
		}

		debounced();
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
		setFiles([]);
		e.target.value = "";
		inputFile.current.value = "";
		document.getElementById("message").style.height = "";
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
			inputFile.current.value = "";
			setFiles([]);
			setText("");
			socket.emit("private-message", state?.data, otherUserId);
			socket.emit("latest-message");
		}
	}, [state]);

	function handleFiles(e) {
		e.preventDefault();

		setFiles(Array.from(e.target.files));
		setMore(false);
		setIsDisabled(false);
	}

	function handleRemoveFile(e) {
		e.preventDefault();
		const item = e.currentTarget.parentElement.getAttribute("data-idx");
		files.splice(item, 1);

		setFiles((prev) => [...prev]);

		// Créer un nouvel objet DataTransfer et y ajouter les fichiers restants
		const dataTransfer = new DataTransfer();
		files.forEach((file) => dataTransfer.items.add(file));

		// Mettre à jour la valeur de inputFile.current.files
		inputFile.current.files = dataTransfer.files;

		if (files.length <= 0) {
			inputFile.current.value = "";
			setIsDisabled(true);
		}
	}
	// console.log(files);
	return (
		<div className={styles.container}>
			<div className={styles.preview}>
				{!checkIfEmpty(files) &&
					files.map((file, idx) => {
						return (
							<div key={idx} data-idx={idx}>
								<FontAwesomeIcon
									icon={faRemove}
									className={styles.remove}
									onClick={handleRemoveFile}
								/>
								<Image
									className={styles.media}
									src={URL.createObjectURL(file)}
									alt="media"
									width={0}
									height={0}
									sizes="100vw"
									quality={100}
								/>
							</div>
						);
					})}
			</div>
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
						onChange={handleFiles}
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
