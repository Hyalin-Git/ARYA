import NavPanel from "@/components/settings/NavPanel";
import styles from "@/styles/layouts/settings/settings.module.css";
export default function SettingsLayout({ children }) {
	return (
		<main>
			<div className={styles.container}>
				<aside className={styles.left}>
					<NavPanel />
				</aside>
				<div className={styles.right}>{children}</div>
			</div>
		</main>
	);
}
