"use server";
import styles from "@/styles/components/user/posts/posts.module.css";
import { getPosts } from "@/api/posts/post";
import Card from "@/components/social/cards/Card";
import { checkIfEmpty } from "@/libs/utils";
import Image from "next/image";

export default async function Posts({ user }) {
	const res = await getPosts(user._id, "desc");
	const posts = res?.data;
	console.log(posts);

	return (
		<div className={styles.container}>
			{!checkIfEmpty(posts) ? (
				posts.map((post) => {
					return <Card element={post} key={post._id} />;
				})
			) : (
				<div className={styles.empty}>
					<Image
						src={"/images/illustrations/no-post.png"}
						alt="illustration"
						width={320}
						height={320}
						style={{
							position: "relative",
						}}
						quality={100}
					/>
					<span>Cet utilisateur n'a encore rien publié</span>
				</div>
			)}
		</div>
	);
}
