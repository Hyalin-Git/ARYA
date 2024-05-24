"use server";
import styles from "@/styles/components/user/posts/posts.module.css";
import { getPosts } from "@/api/posts/post";
import Card from "@/components/social/cards/Card";

export default async function Posts({ user }) {
	const res = await getPosts(user._id, "desc");
	const posts = res.data;

	return (
		<div className={styles.container}>
			{posts.map((post) => {
				return <Card element={post} key={post._id} />;
			})}
		</div>
	);
}
