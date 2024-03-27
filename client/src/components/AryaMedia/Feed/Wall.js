"use server";
import styles from "@/styles/components/aryaMedia/posts.module.css";
import AllFeed from "@/components/AryaMedia/Feed/AllFeed";
import { getFeed } from "@/api/posts/feed";

export default async function Wall() {
	const feed = await getFeed(10);

	return (
		<div className={styles.container}>
			{feed.map((posts) => {
				return <AllFeed posts={posts} key={posts._id} />;
			})}
		</div>
	);
}
