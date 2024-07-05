import styles from "@/styles/components/chat/chat.module.css";
import { getConversation } from "@/api/conversations/conversations";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import useSWR from "swr";

export default function Chat({
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
					width={50}
					height={50}
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
			<div className={styles.conversation}></div>
			{/* input to send msg */}
			<div className={styles.form}></div>
		</div>
	);
}
