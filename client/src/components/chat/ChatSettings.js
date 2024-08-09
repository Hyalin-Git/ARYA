import { updateConversation } from "@/actions/conversation";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/chat/chatSettings.module.css";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
	faArrowLeft,
	faBan,
	faImage,
	faLock,
	faLockOpen,
	faUsers,
	faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import socket from "@/libs/socket";
import { mutate } from "swr";
import { blockUser, unblockUser } from "@/api/user/user";
import { AuthContext } from "@/context/auth";
import { deleteConversation } from "@/api/conversations/conversations";

const initialState = {
	status: "pending",
	message: "",
	data: {},
	error: [],
};

export default function ChatSettings({
	conversation,
	uid,
	otherUserId,
	setSettings,
	setOpenedConv,
	setOtherUserId,
}) {
	const { user, setUser } = useContext(AuthContext);
	const formRef = useRef(null);
	const [editName, setEditName] = useState(false);
	// const [hasBlocked, setHasBlocked] = useState(false);
	const convName = conversation?.name;
	const hasBlocked = user?.blockedUsers?.includes(otherUserId);
	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	const updateConversationWithId = updateConversation.bind(
		null,
		uid,
		otherUserId
	);
	const [state, formAction] = useFormState(
		updateConversationWithId,
		initialState
	);

	function goBack(e) {
		e.preventDefault();
		setSettings(false);
	}

	async function handleBlockUser(e) {
		e.preventDefault();
		const res = await blockUser(uid, otherUserId);
		if (res) {
			socket.emit("block-user", uid, otherUserId);
			setUser(res);
		}
	}

	async function handleUnblockUser(e) {
		e.preventDefault();
		const res = await unblockUser(uid, otherUserId);

		if (res) {
			socket.emit("unblock-user", uid, otherUserId);
			setUser(res);
		}
	}

	async function handleDeleteConversation(e) {
		e.preventDefault();
		const res = await deleteConversation(conversation?._id, uid, otherUserId);

		if (res) {
			setOpenedConv(null);
			setOtherUserId(null);
		}
	}

	useEffect(() => {
		// Listening if the user press escape or enter
		window.addEventListener("keydown", (e) => {
			// if espace is pressed quit the msg edition
			if (e.key === "Escape") {
				e.preventDefault();
				setEditName(false);
			}
			// if enter and shift key are pressed at the same time nothing happen
			if (e.key === "Enter" && e.shiftKey) {
				return;
			} else if (e.key === "Enter") {
				// If enter alone is pressed then sending the form
				formRef?.current?.requestSubmit();
			}
		});
	}, [formRef]);

	useEffect(() => {
		if (state?.status === "success") {
			setEditName(false);
			socket.emit("update-conversation-name");
		}
	}, [state]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<FontAwesomeIcon icon={faArrowLeft} onClick={goBack} />
			</div>
			<div className={styles.conversation}>
				<div>
					<Image
						src={getOtherUserInfo?.picture || "/images/profil/default-pfp.jpg"}
						alt="picture"
						width={80}
						height={80}
						quality={100}
					/>
				</div>
				{editName ? (
					<div className={styles.form}>
						<form action={formAction} ref={formRef}>
							<input
								type="text"
								id="conversation-name"
								name="conversation-name"
								className={montserrat.className}
								placeholder="Renommer la conversation"
								maxLength={15}
							/>
							<input
								type="text"
								name="conversationId"
								id="conversationId"
								value={conversation?._id}
								hidden
							/>
							<div className={styles.buttons}>
								<p>
									échap pour{" "}
									<button
										className={montserrat.className}
										onClick={(e) => {
											e.preventDefault();
											setEditName(false);
										}}>
										annuler
									</button>{" "}
									entrer pour{" "}
									<button className={montserrat.className}>modifier</button>
								</p>
							</div>
						</form>
					</div>
				) : (
					<>
						{convName ? (
							<div className={styles.name}>
								<span>{convName}</span>
								{convName && (
									<div>
										<form action={formAction} ref={formRef}>
											<input
												type="text"
												id="conversation-name"
												name="conversation-name"
												value={""}
												hidden
											/>
											<input
												type="text"
												name="conversationId"
												id="conversationId"
												value={conversation?._id}
												hidden
											/>
											<div className={styles.buttons}>
												<button className={styles.deleteName}>
													Supprimer le nom de la conversation
												</button>
											</div>
										</form>
									</div>
								)}
							</div>
						) : (
							<div className={styles.name}>
								<span>
									{getOtherUserInfo?.firstName +
										" " +
										getOtherUserInfo?.lastName}
								</span>
								<span>{getOtherUserInfo?.userName}</span>
							</div>
						)}
					</>
				)}
			</div>

			<div className={styles.actionsWrapper}>
				<div className={styles.actions}>
					<ul>
						<li onClick={(e) => setEditName(!editName)}>
							<FontAwesomeIcon icon={faWandMagicSparkles} /> Renommer la
							conversation
						</li>

						<li className={styles.underline}></li>
						<li>
							<FontAwesomeIcon icon={faUsers} /> Créer un groupe avec{" "}
							{getOtherUserInfo?.firstName}
						</li>
						<li className={styles.underline}></li>
						<li>
							<FontAwesomeIcon icon={faImage} /> Voir les fichiers partagés
						</li>
						<li className={styles.underline}></li>
						{hasBlocked ? (
							<li onClick={handleUnblockUser}>
								<FontAwesomeIcon icon={faLockOpen} /> Débloquer{" "}
								{getOtherUserInfo?.firstName}
							</li>
						) : (
							<li onClick={handleBlockUser}>
								<FontAwesomeIcon icon={faLock} /> Bloquer{" "}
								{getOtherUserInfo?.firstName}
							</li>
						)}
						<li className={styles.underline}></li>
						<li onClick={handleDeleteConversation}>
							<FontAwesomeIcon icon={faTrashCan} /> Supprimer la conversation
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
