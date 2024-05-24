"use server";
import { getUserLikes } from "@/api/user/user";
import Card from "@/components/social/cards/Card";
import styles from "@/styles/components/user/posts/posts.module.css";

export default async function Likes({ user }) {
	const likes = await getUserLikes(user._id);
	const isError = likes.error === true;
	console.log(likes);
	return (
		<div className={styles.container}>
			{isError ? (
				<div>{likes.message}</div>
			) : (
				<>
					{likes.map((like) => {
						return <Card element={like} key={like._id} />;
					})}
				</>
			)}
		</div>
	);
}
