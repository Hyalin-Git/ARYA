"use server";
import AllFeed from "@/components/social/Feed/AllFeed";
import SendCard from "@/components/social/SendCard";
import styles from "@/styles/pages/social.module.css";
import { savePost } from "@/actions/post";
import { getAllFeed } from "@/api/posts/feed";

const INITIAL_LIMIT = 3;

export default async function Social() {
	const initialPosts = await getAllFeed(0, INITIAL_LIMIT);

	return (
		<div className={styles.container}>
			<AllFeed initialPosts={initialPosts} />
		</div>
	);
}
