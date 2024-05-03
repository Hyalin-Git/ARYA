"use server";
import styles from "@/styles/layouts/social/social.module.css";
import Header from "@/layouts/Header";
import UserPanel from "@/layouts/social/UserPanel";
import SuggestionsPanel from "@/layouts/social/SuggestionsPanel";
import ConversationPanel from "@/layouts/social/ConversationPanel";
import { getFollowSuggestions } from "@/api/user/user";

export default async function AryaMediaLayout({ children }) {
	const suggestions = await getFollowSuggestions();
	return (
		<>
			<Header />
			<main className={styles.main}>
				<div className={styles.container}>
					<aside>
						<UserPanel />
						<SuggestionsPanel suggestions={suggestions} />
					</aside>
					<div className={styles.column}>{children}</div>
					<aside>
						<ConversationPanel />
					</aside>
				</div>
			</main>
		</>
	);
}
