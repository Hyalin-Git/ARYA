import FollowPanel from "@/components/AryaMedia/FollowPanel";
import SendPostPanel from "@/components/AryaMedia/SendPostPanel";
import UserPanel from "@/components/AryaMedia/UserPanel";
import styles from "@/styles/pages/aryaMedia.module.css";
import { Suspense } from "react";

export default function AryaMedia() {
	return (
		<div className={styles.column}>
			<SendPostPanel />
		</div>
	);
}
