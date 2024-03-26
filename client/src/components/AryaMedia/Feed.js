import { getFeed } from "@/api/posts/feed";

export default async function Feed() {
	const feed = await getFeed();
	return (
		<div>
			{feed.map((posts) => {
				return (
					<div key={posts._id}>
						<p>{posts?.text}</p>
					</div>
				);
			})}
		</div>
	);
}
