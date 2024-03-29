import styles from "@/styles/pages/aryaMedia.module.css";
import Header from "@/layouts/Header";
import UserPanel from "@/layouts/AryaMedia/UserPanel";
import FollowPanel from "@/layouts/AryaMedia/FollowPanel";

export default function AryaMediaLayout({ children }) {
	return (
		<>
			<Header />
			<main className={styles.main}>
				<div className={styles.container}>
					<aside>
						<UserPanel />
						<FollowPanel />
					</aside>
					{children}
					<aside>
						<UserPanel />
					</aside>
				</div>
			</main>
		</>
	);
}
