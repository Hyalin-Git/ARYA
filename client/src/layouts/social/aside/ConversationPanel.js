"use server";
import { getConversations } from "@/api/conversations/conversations";
import Conversations from "@/components/social/conversations/Conversations";
import styles from "@/styles/layouts/social/aside/conversationPanel.module.css";
import Image from "next/image";
import { ConversationHeader } from "./ConversationHeader";

export default async function ConversationPanel() {
	const conversations = await getConversations();
	console.log(conversations);
	const notFound = conversations?.message?.includes(
		"Aucune conversations n'a été trouvé"
	);
	return (
		<div className={styles.container}>
			<ConversationHeader />
			<div className={styles.content} id="content">
				{notFound ? (
					<div className={styles.empty}>
						<Image
							src={"/images/illustrations/no-message.png"}
							alt="illustration"
							width={200}
							height={200}
						/>
						<span>Aucun message ?</span>
						<p>C'est pas grâve ça va venir</p>
					</div>
				) : (
					<>
						{conversations?.map((conversation) => {
							return (
								<Conversations
									conversation={conversation}
									key={conversation._id}
								/>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}
