"use server";
import { getConversations } from "@/api/conversations/conversations";

import Conversation from "@/components/social/Feed/Conversation";
import styles from "@/styles/layouts/social/conversationPanel.module.css";

export default async function ConversationPanel() {
	const conversations = await getConversations();
	const notFound = conversations?.message?.includes(
		"Aucune conversations n'a été trouvée"
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
								<Conversation
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
