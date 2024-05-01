"use server";
import styles from "@/styles/pages/social.module.css";
import { getComment } from "@/api/comments/comments";
import { getPost } from "@/api/posts/post";
import Card from "@/components/social/cards/Card";
import { getRepost } from "@/api/posts/repost";
import Link from "next/link";

export default async function Post({ params }) {
	const post = await getPost(params.id);
	const comment = await getComment(params.id);
	const repost = await getRepost(params.id);
	const value =
		post?.error !== true
			? post
			: comment?.error !== true
			? comment
			: repost?.error !== true
			? repost
			: null;
	// element will take the first value who is not null, so post, or comment or repost
	const element = value;

	console.log(element);
	return (
		<div className={styles.container}>
			{/* Return card component and take the element as props */}
			{element ? (
				<Card element={element} hasParams={params.id ? true : false} />
			) : (
				<div id="not_found">
					<span>Cette publication n'existe pas ou plus</span>

					<div>
						<Link href={"/social"}>
							<button>Revenir au fil d'actualité</button>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
