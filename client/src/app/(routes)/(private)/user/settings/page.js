"use server";
import CvEditor from "@/components/settings/CvEditor";
import LookingForJobEditor from "@/components/settings/LookingForJobEditor";
import NavPanel from "@/components/settings/NavPanel";
import SocialEditor from "@/components/settings/SocialEditor";
import ToolsEditor from "@/components/settings/ToolsEditor";
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
					<LookingForJobEditor />
					<SocialEditor />
					<ToolsEditor />
					<CvEditor />
				</div>
			</div>
		</main>
	);
}
