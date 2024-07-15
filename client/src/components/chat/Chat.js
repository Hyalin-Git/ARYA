import styles from "@/styles/components/chat/chat.module.css";
import { getConversation } from "@/api/conversations/conversations";
import {
	faAngleLeft,
	faAngleRight,
	faArrowLeft,
	faEllipsisVertical,
	faImage,
	faPaperPlane,
	faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import useSWR from "swr";
import { montserrat } from "@/libs/fonts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { AuthContext } from "@/context/auth";
import { saveMessage } from "@/actions/message";
import { socket } from "@/libs/socket";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};

export default function Chat({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const { uid } = useContext(AuthContext);

	// form action
	const saveMessageWithUid = saveMessage.bind(null, uid);
	const [state, formAction] = useFormState(saveMessageWithUid, initialState);

	// use state
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [isFocus, setIsFocus] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	// SWR
	const getConversationWithId = getConversation.bind(
		null,
		conversationId,
		otherUserId
	);
	const { data, error, isLoading } = useSWR(
		`/conversations/${conversationId}`,
		getConversationWithId,
		{
			revalidateOnMount: true,
			revalidateOnFocus: true,
		}
	);
	const getOtherUserInfo = data?.users?.find(
		(user) => user._id === otherUserId
	);

	console.log("THE CONV INFO", data);
	function goBack(e) {
		e.preventDefault();
		setOpenedConv(null);
		setOtherUserId(null);
	}

	function displayMessage(message) {
		const div = document.createElement("div");
		div.textContent = message;
		document?.getElementById("conversation").append(div);
	}

	useEffect(() => {
		// socket.on("connect", () => {
		// 	console.log("played");
		// 	displayMessage(`You connected with id: ${socket.id}`);
		// });
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		socket.once("connect", onConnect);
		if (isConnected) {
			displayMessage(`You connected with id: ${socket.id}`);
		}
		socket.once("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	socket.on("receive-message", (message) => {
		console.log("bordel mais marche");
	});

	// useMemo(() => {
	// 	if (state.status === "success") {
	// 		document.getElementById("message").value = "";
	// 	}
	// }, [state]);

	return (
		<div className={styles.container}>
			{/* header */}
			<div className={styles.header}>
				<FontAwesomeIcon icon={faArrowLeft} onClick={goBack} />
				<Image
					src={getOtherUserInfo?.picture || "/images/profil/default-pfp.jpg"}
					alt="picture"
					width={40}
					height={40}
					quality={100}
				/>
				<div className={styles.names}>
					<span>
						{getOtherUserInfo?.firstName + " " + getOtherUserInfo?.lastName}
					</span>
					<span>{getOtherUserInfo?.userName}</span>
				</div>
			</div>
			{/* main conv  */}
			<div className={styles.conversation} id="conversation">
				{/* <div data-self={false}>
					<div>
						<p>Salut, j'aimerais te recruter</p>
					</div>
				</div> */}
			</div>
			{/* input to send msg */}
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
					<div className={styles.message}>
						<textarea
							name="message"
							id="message"
							placeholder="Écrire un nouveau message"
							rows={1}
							className={montserrat.className}
							onFocus={(e) => setIsFocus(true)}
							onBlur={(e) => setIsFocus(false)}
							onChange={(e) => {
								e.preventDefault();
								e.target.style.height = "";
								e.target.style.height = e.target.scrollHeight + "px";

								if (e.target.value.length > 0) {
									setIsDisabled(false);
								} else {
									setIsDisabled(true);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.shiftKey) {
								} else if (e.key === "Enter") {
									e.preventDefault();
									document.getElementById("send-message").requestSubmit();
									socket.emit("send-message", e.target.value);
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
		</div>
	);
}
