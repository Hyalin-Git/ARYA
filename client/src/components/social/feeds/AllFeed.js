"use client";
import styles from "@/styles/components/social/feeds/feeds.module.css";
import { getAllFeed, getFollowingFeed } from "@/api/posts/feed";
import Card from "../cards/Card";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import SendCard from "../cards/SendCard";
import { savePost } from "@/actions/post";
import { AuthContext } from "@/context/auth";
import Link from "next/link";

export default function AllFeed({ initialPosts, key, notFound }) {
	const { uid } = useContext(AuthContext);
	const [limit, setLimit] = useState(3);
	const [scheduledTime, setScheduledTime] = useState(""); // The choosen send time by the user
	const savePostWithUid = savePost.bind(null, uid, scheduledTime);
	const { ref, inView } = useInView();

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null; // reached the end
		return `${key}?offset=${0}&limit=${limit}`; // SWR key
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
			refreshInterval: 60000,
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
		<div className={styles.container} id="scroll">
			<div className={styles.filters}>
				<Link href={"/social"}>
					<span>Pour toi</span>
				</Link>
				<Link href={"/social/following"}>
					<span>Abonnements</span>
				</Link>
			</div>
			{notFound ? (
				<div>not found</div>
			) : (
				<>
					<SendCard
						action={savePostWithUid}
						type={"post"}
						button={"Poster"}
						mutatePost={mutate}
						scheduledTime={scheduledTime}
						setScheduledTime={setScheduledTime}
					/>
					<div className={styles.cards}>
						{data[0]?.length > 0 &&
							data[0]?.map((post) => {
								return (
									<Card element={post} key={post._id} mutatePost={mutate} />
								);
							})}
					</div>
					<div id="loader" ref={ref}>
						{isLoading && (
							<>
								<div></div>
								<div></div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
