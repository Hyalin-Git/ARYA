"use client";
import styles from "@/styles/components/social/allFeed/allFeed.module.css";
import { getAllFeed } from "@/api/posts/feed";
import Card from "../cards/Card";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import SendCard from "../SendCard";
import { savePost } from "@/actions/post";
import { AuthContext } from "@/context/auth";

export default function AllFeed({ initialPosts }) {
	const { uid } = useContext(AuthContext);
	const [limit, setLimit] = useState(3);
	const savePostWithUid = savePost.bind(null, uid);
	const { ref, inView } = useInView();
	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null; // reached the end
		return `/api/feed?offset=${0}&limit=${limit}`; // SWR key
	};

	const fetchPosts = getAllFeed.bind(null, 0, limit);
	const { data, size, setSize, mutate, isValidating, error, isLoading } =
		useSWRInfinite(getKey, fetchPosts, {
			initialSize: 1,
			fallbackData: [initialPosts],
			keepPreviousData: true,
			revalidateIfStale: true,
			revalidateFirstPage: true,
			revalidateOnMount: true,
			revalidateAll: true,
		});

	async function loadMorePosts() {
		setSize(size + 1);
		setLimit(limit + 2);
	}

	useEffect(() => {
		if (inView) {
			loadMorePosts();
		}
	}, [inView]);

	return (
		<div className={styles.container}>
			<div className={styles.filters}>
				<span>Pour toi</span>
				<span>Abonnements</span>
			</div>
			<SendCard
				action={savePostWithUid}
				type={"post"}
				button={"Poster"}
				mutatePost={mutate}
			/>
			<div className={styles.cards}>
				{data[0]?.length > 0 &&
					data[0]?.map((post) => {
						return <Card element={post} key={post._id} mutatePost={mutate} />;
					})}
			</div>
			<div className={styles.loader} ref={ref}>
				{isLoading && (
					<>
						<div></div>
						<div></div>
					</>
				)}
			</div>
		</div>
	);
}
