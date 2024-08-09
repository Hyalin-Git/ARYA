"use client";
import styles from "@/styles/components/chat/chat.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import useSWR, { mutate } from "swr";
import { getConversation } from "@/api/conversations/conversations";
import { addToRead } from "@/api/conversations/message";
import { getBlockedUsers } from "@/api/user/user";
import ChatSettings from "./ChatSettings";
import socket from "@/libs/socket";

export default function Chat({
	conversationId,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
}) {
	const { user, uid } = useContext(AuthContext);
	const [settings, setSettings] = useState(false);
	const [isTyping, setIsTyping] = useState({
		boolean: false,
		conversationId: "",
	});

	const getConversationWithId = getConversation.bind(
		null,
		conversationId,
		otherUserId
	);
	const { data, error, isLoading } = useSWR(
		`/conversations/${conversationId}`,
		getConversationWithId
	);
	const latestMessage = data?.data?.latestMessage;

	useEffect(() => {
		addToRead(latestMessage, uid);
	}, [data]);

	useEffect(() => {
		socket.on("updated-conversation-name", () => {
			mutate(`/conversations/${conversationId}`);
		});

		socket.on("blocked-user", () => {
			mutate(`/conversations/${conversationId}`);
		});
		socket.on("unblocked-user", () => {
			mutate(`/conversations/${conversationId}`);
		});
		return () => {
			socket.off("updated-conversation-name");
			socket.off("blocked-user");
			socket.off("unblocked-user");
		};
	}, [socket]);

	return (
		<div className={styles.container}>
			{!settings ? (
				<>
					{/* header */}
					<ChatHeader
						uid={uid}
						user={user}
						conversation={data?.data}
						otherUserId={otherUserId}
						setOpenedConv={setOpenedConv}
						setOtherUserId={setOtherUserId}
						setSettings={setSettings}
					/>
					{/* main conv  */}
					<ChatBody
						conversation={data?.data}
						conversationId={conversationId}
						uid={uid}
						otherUserId={otherUserId}
						isTyping={isTyping}
						setIsTyping={setIsTyping}
					/>

					{/* input to send msg */}

					{!isLoading && (
						<ChatFooter
							conversationId={conversationId}
							isBlocked={data?.isBlocked}
							otherUserId={otherUserId}
							uid={uid}
							setIsTyping={setIsTyping}
						/>
					)}
				</>
			) : (
				<ChatSettings
					conversation={data?.data}
					uid={uid}
					otherUserId={otherUserId}
					setSettings={setSettings}
					setOpenedConv={setOpenedConv}
					setOtherUserId={setOtherUserId}
				/>
			)}
		</div>
	);
}
