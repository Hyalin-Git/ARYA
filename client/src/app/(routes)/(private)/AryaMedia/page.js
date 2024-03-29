import AllFeed from "@/components/AryaMedia/Feed/AllFeed";
import FollowingFeed from "@/components/AryaMedia/Feed/FollowingFeed";
import SendPostPanel from "@/components/AryaMedia/SendPostPanel";
import styles from "@/styles/pages/aryaMedia.module.css";

export default function AryaMedia() {
	return (
		<div className={styles.column}>
			<SendPostPanel />
			{/* <div className={styles.filters}>
				<span>Pour toi</span>
				<span>Abonnement</span>
			</div> */}

			<AllFeed />
		</div>
	);
}
