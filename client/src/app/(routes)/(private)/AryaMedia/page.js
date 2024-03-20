import UserPanel from "@/components/AryaMedia/UserPanel";
import styles from "@/styles/pages/aryaMedia.module.css";
import { Suspense } from "react";

export default function AryaMedia() {
	return (
		<main className={styles.main}>
			<div className={styles.column}>
				<div className={styles.userInfo}>
					<Suspense fallback={<h2>yas</h2>}>
						<UserPanel />
					</Suspense>
				</div>
				<div>yas</div>
			</div>
		</main>
	);
}
