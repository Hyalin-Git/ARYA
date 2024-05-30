"use server";
import NavPanel from "@/components/settings/NavPanel";
import SocialEditor from "@/components/settings/SocialEditor";
import UserEditor from "@/components/settings/UserEditor";
import styles from "@/styles/pages/settings.module.css";
export default async function Settings() {
	return (
		<main>
			<div className={styles.container}>
				<aside className={styles.left}>
					<NavPanel />
				</aside>
				<div className={styles.right}>
					<UserEditor />
					<SocialEditor />
				</div>
			</div>
		</main>
	);
}
