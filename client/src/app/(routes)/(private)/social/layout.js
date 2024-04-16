"use server";
import styles from "@/styles/layouts/social/social.module.css";
import Header from "@/layouts/Header";
import UserPanel from "@/layouts/social/UserPanel";
import SuggestionsPanel from "@/layouts/social/SuggestionsPanel";
import ConversationPanel from "@/layouts/social/ConversationPanel";

export default async function AryaMediaLayout({ children }) {
	return (
		<>
			<Header />
			<main className={styles.main}>
				<div className={styles.container}>
					<aside>
						<UserPanel />
						<SuggestionsPanel />
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
