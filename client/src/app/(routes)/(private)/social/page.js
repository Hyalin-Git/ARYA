import AllFeed from "@/components/AryaMedia/Feed/AllFeed";
import FollowingFeed from "@/components/AryaMedia/Feed/FollowingFeed";
import SendCard from "@/components/AryaMedia/SendCard";
import styles from "@/styles/pages/aryaMedia.module.css";
import { savePost } from "@/actions/post";

export default function AryaMedia() {
	return (
		<div className={styles.column}>
			<SendCard action={savePost} type={"post"} button={"Poster"} />
			{/* <div className={styles.filters}>
				<span>Pour toi</span>
				<span>Abonnement</span>
			</div> */}

			<AllFeed />
		</div>
	);
}
