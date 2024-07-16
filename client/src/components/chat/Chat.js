"use client";
import styles from "@/styles/components/chat/chat.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

export default function Chat({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const { uid } = useContext(AuthContext);

	return (
		<div className={styles.container}>
			{/* header */}
			<ChatHeader
				conversationId={conversationId}
				otherUserId={otherUserId}
				setOpenedConv={setOpenedConv}
				setOtherUserId={setOtherUserId}
			/>
			{/* main conv  */}
			<ChatBody conversationId={conversationId} uid={uid} />

			{/* input to send msg */}
			<ChatFooter conversationId={conversationId} uid={uid} />
		</div>
	);
}
