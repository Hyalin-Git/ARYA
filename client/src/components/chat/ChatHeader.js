import styles from "@/styles/components/chat/chat.module.css";
import {
	getConversation,
	revalidateConversations,
} from "@/api/conversations/conversations";
import { faArrowLeft, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from "swr";
import Image from "next/image";
import { useEffect } from "react";
import socket from "@/libs/socket";

export default function ChatHeader({
	conversation,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	function goBack(e) {
		e.preventDefault();
		setOpenedConv(null);
		setOtherUserId(null);
	}

	return (
		<div className={styles.header}>
			<FontAwesomeIcon
				icon={faArrowLeft}
				onClick={goBack}
				className={styles.back}
			/>
			<Image
				src={getOtherUserInfo?.picture || "/images/profil/default-pfp.jpg"}
				alt="picture"
				width={40}
				height={40}
				quality={100}
			/>
			<FontAwesomeIcon
				data-connected={getOtherUserInfo?.status?.isConnected}
				className={styles.connectivity}
				icon={faCircle}
			/>
			<div className={styles.names}>
				<span>
					{getOtherUserInfo?.firstName + " " + getOtherUserInfo?.lastName}
				</span>
				<span>{getOtherUserInfo?.userName}</span>
			</div>
			{/* <div>
                 <FontAwesomeIcon icon={faUserPlus} />
                 <FontAwesomeIcon icon={faBan} />
             </div> */}
		</div>
	);
}
