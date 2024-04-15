"use client";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import { getAllFeed } from "@/api/posts/feed";
import Card from "../Card";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWR, { mutate } from "swr";

const POSTS_TO_FETCH = 5;

export default function AllFeed({ initialPosts }) {
	const [offset, setOffset] = useState(POSTS_TO_FETCH);
	const [posts, setPosts] = useState(initialPosts);
	// const [isLoading, setIsLoading] = useState(false);
	const { ref, inView } = useInView();
	const fetchPosts = getAllFeed.bind(null, offset, offset + POSTS_TO_FETCH);
	const { data, isLoading } = useSWR("/api/feed", fetchPosts);

	async function loadMorePosts() {
		// setIsLoading(true);
		// const getPosts = await getAllFeed(offset, offset + POSTS_TO_FETCH);

		setPosts((prevPosts) => [...prevPosts, ...data]);
		setOffset(offset + POSTS_TO_FETCH);
		// mutate("/api/feed");
		// setIsLoading(false);
	}
	useEffect(() => {
		if (inView) {
			loadMorePosts();
		}
	}, [inView]);

	return (
		<div className={styles.container}>
			{posts.length > 0 &&
				posts.map((post) => {
					return <Card post={post} key={post._id} />;
				})}
			<div ref={ref}>{isLoading && <div>loading</div>}</div>
		</div>
	);
}
