"use server";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import { getAllFeed } from "@/api/posts/feed";
import Feed from "./Feed";
import Comments from "./Comments";

export default async function AllFeed() {
	const allFeed = await getAllFeed(10);
	return (
		<div className={styles.container}>
			{allFeed.length > 0 &&
				allFeed.map((post) => {
					return <Feed post={post} key={post._id} />;
				})}
		</div>
	);
}
