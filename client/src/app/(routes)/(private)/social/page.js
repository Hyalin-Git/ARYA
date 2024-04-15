"use server";
import AllFeed from "@/components/social/Feed/AllFeed";
import SendCard from "@/components/social/SendCard";
import styles from "@/styles/pages/aryaMedia.module.css";
import { savePost } from "@/actions/post";
import { getAllFeed } from "@/api/posts/feed";

const INITIAL_LIMIT = 5;

export default async function Social() {
	const initialPosts = await getAllFeed(0, INITIAL_LIMIT);

	return (
		<div className={styles.column}>
			<SendCard action={savePost} type={"post"} button={"Poster"} />
			<div className={styles.filters}>
				<span>Pour toi</span>
				<span>Abonnement</span>
			</div>
			<AllFeed initialPosts={initialPosts} />
		</div>
	);
}
