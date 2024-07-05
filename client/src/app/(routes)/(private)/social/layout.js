"use server";
import styles from "@/styles/layouts/social/social.module.css";
import UserPanel from "@/layouts/social/aside/UserPanel";
import SuggestionsPanel from "@/layouts/social/aside/SuggestionsPanel";
import ConversationPanel from "@/layouts/social/aside/ConversationPanel";
import { getFollowSuggestions } from "@/api/user/user";
import { getConversations } from "@/api/conversations/conversations";

export default async function AryaMediaLayout({ children }) {
	const suggestions = await getFollowSuggestions();
	const conversations = await getConversations();

	return (
		<>
			<main className={styles.main}>
				<div className={styles.container}>
					<aside>
						<UserPanel />
						<SuggestionsPanel suggestions={suggestions} />
					</aside>
					<div className={styles.column}>{children}</div>
					<aside>
						<ConversationPanel conversations={conversations} />
					</aside>
				</div>
			</main>
		</>
	);
}
