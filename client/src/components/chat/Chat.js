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
import { useState } from "react";

export default function Chat({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const [isFocus, setIsFocus] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
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
			<div className={styles.conversation}>
				<div data-self={false}>
					<div>
						<p>Salut, j'aimerais te recruter</p>
					</div>
				</div>
				<div data-self={true}>
					<div>
						<p>
							Salut, ça serait avec plaisir, mais je ne suis pas disponible tout
							de suite...
						</p>
					</div>
					<div>
						<p>Je vous envoie mes disponibilités dès que possible</p>
					</div>
				</div>
				<div data-self={false}>
					<div>
						<p>Pas de soucis</p>
					</div>
				</div>
			</div>
			{/* input to send msg */}
			<div className={styles.form}>
				<form action="">
					<div className={styles.icons}>
						{isFocus ? (
							<FontAwesomeIcon icon={faEllipsisVertical} />
						) : (
							<>
								<label htmlFor="img">
									<FontAwesomeIcon icon={faImage} />
								</label>
								<input type="file" id="img" name="img" hidden />
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
							}}></textarea>
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
