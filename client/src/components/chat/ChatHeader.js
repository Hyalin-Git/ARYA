import styles from "@/styles/components/chat/chat.module.css";
import { getConversation } from "@/api/conversations/conversations";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from "swr";
import Image from "next/image";

export default function ChatHeader({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const getConversationWithId = getConversation.bind(
		null,
		conversationId,
		otherUserId
	);
	const conversationData = useSWR(
		`/conversations/${conversationId}`,
		getConversationWithId
	);
	const getOtherUserInfo = conversationData?.data?.users?.find(
		(user) => user._id === otherUserId
	);

	function goBack(e) {
		e.preventDefault();
		setOpenedConv(null);
		setOtherUserId(null);
	}

	return (
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
			{/* <div>
                 <FontAwesomeIcon icon={faUserPlus} />
                 <FontAwesomeIcon icon={faBan} />
             </div> */}
		</div>
	);
}
