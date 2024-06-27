"use server";
import { getConversations } from "@/api/conversations/conversations";
import Conversations from "@/components/social/conversations/Conversations";
import styles from "@/styles/layouts/social/aside/conversationPanel.module.css";

export default async function ConversationPanel() {
	const conversations = await getConversations();
	console.log(conversations);
	const notFound = conversations?.message?.includes(
		"Aucune conversations n'a été trouvé"
	);
	console.log(notFound);

	return (
		<div className={styles.container}>
			<div className={styles.header}>Messagerie</div>
			<div className={styles.body}>
				{notFound ? (
					<div>Aucun</div>
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
