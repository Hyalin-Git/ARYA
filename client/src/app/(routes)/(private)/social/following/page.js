"use server";
import { getFollowingFeed } from "@/api/posts/feed";
import FollowingFeed from "@/components/social/Feeds/FollowingFeed";
import styles from "@/styles/pages/social.module.css";

const INITIAL_LIMIT = 3;
export default async function Following() {
	const initialPosts = await getFollowingFeed(0, INITIAL_LIMIT);
	const notFound = initialPosts?.message?.includes(
		"Aucune publication trouvée"
	);

	return (
		<div className={styles.container}>
			<FollowingFeed initialPosts={initialPosts} notFound={notFound} />
		</div>
	);
}
