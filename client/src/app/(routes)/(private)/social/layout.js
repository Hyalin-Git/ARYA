"use server";
import styles from "@/styles/pages/aryaMedia.module.css";
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
					{children}
					<aside>
						<ConversationPanel />
					</aside>
				</div>
			</main>
		</>
	);
}
