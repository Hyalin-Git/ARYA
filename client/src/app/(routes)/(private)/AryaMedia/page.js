import Wall from "@/components/AryaMedia/Feed/Wall";
import SendPostPanel from "@/components/AryaMedia/SendPostPanel";

import styles from "@/styles/pages/aryaMedia.module.css";

export default function AryaMedia() {
	return (
		<div className={styles.column}>
			<SendPostPanel />

			<Wall />
		</div>
	);
}
