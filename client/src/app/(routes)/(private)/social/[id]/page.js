"use server";

import { getPost } from "@/api/posts/post";
import Card from "@/components/social/cards/Card";

export default async function Post({ params }) {
	const post = await getPost(params.id);
	// const comment = await getComment();
	// const repost = await getRepost();

	// element will take the first value who is not null, so post, or comment or repost
	const element = post || comment || repost;
	console.log(post);
	return (
		<div>
			{/* Return card component and take the element as props */}
			<Card element={element} />
		</div>
	);
}
