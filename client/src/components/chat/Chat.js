"use client";
import styles from "@/styles/components/chat/chat.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import useSWR from "swr";
import { getConversation } from "@/api/conversations/conversations";

export default function Chat({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const { uid } = useContext(AuthContext);
	const [isTyping, setIsTyping] = useState({
		boolean: false,
		conversationId: "",
	});

	const getConversationWithId = getConversation.bind(
		null,
		conversationId,
		otherUserId
	);
	const { data, error, loading } = useSWR(
		`/conversations/${conversationId}`,
		getConversationWithId
	);

	return (
		<div className={styles.container}>
			{/* header */}
			<ChatHeader
				conversation={data}
				otherUserId={otherUserId}
				setOpenedConv={setOpenedConv}
				setOtherUserId={setOtherUserId}
			/>
			{/* main conv  */}
			<ChatBody
				conversationId={conversationId}
				uid={uid}
				isTyping={isTyping}
				setIsTyping={setIsTyping}
			/>

			{/* input to send msg */}
			<ChatFooter
				conversationId={conversationId}
				conversation={data}
				otherUserId={otherUserId}
				uid={uid}
				setIsTyping={setIsTyping}
			/>
		</div>
	);
}
