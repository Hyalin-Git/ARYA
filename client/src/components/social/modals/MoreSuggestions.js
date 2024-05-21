import styles from "@/styles/components/social/modals/moreSuggestions.module.css";
import { getFollowSuggestions } from "@/api/user/user";
import Image from "next/image";
import FollowButton from "@/components/social/FollowButton";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

export default function MoreSuggestions({ setMore }) {
	const [loadedOnce, setLoadedOnce] = useState(false);
	const { ref, inView } = useInView();
	const [limit, setLimit] = useState(10);
	const getSuggestionsWithLimit = getFollowSuggestions.bind(null, limit);

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null; // reached the end
		return `users/suggestion?limit=${limit}`; // SWR key
	};

	const { data, size, setSize, mutate, isValidating, error, isLoading } =
		useSWRInfinite(getKey, getSuggestionsWithLimit, {
			initialSize: 1,
			keepPreviousData: true,
			revalidateIfStale: true,
			revalidateFirstPage: true,
			revalidateOnMount: true,
			revalidateAll: true,
		});

	console.log(data);

	async function loadMorePosts() {
		setSize(size + 1);
		setLimit(limit + 10);
	}

	useEffect(() => {
		if (inView) {
			loadMorePosts();
		}
	}, [inView]);

	useMemo(() => {
		if (data) {
			setLoadedOnce(true);
		}
	}, [data]);

	console.log(loadedOnce);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.header}>
					<span>Personnes ayant les mêmes centres d'intérêt</span>
				</div>
				<div className={styles.content}>
					{!loadedOnce ? (
						<div>loader</div>
					) : (
						<>
							{data[0]?.map((suggestion) => {
								return (
									<div className={styles.users} key={suggestion._id}>
										<div className={styles.left}>
											<Image
												src={
													suggestion.picture
														? suggestion.picture
														: "/images/profil/default-pfp.jpg"
												}
												alt="picture"
												width={55}
												height={55}
												quality={100}
											/>
											<div className={styles.usernames}>
												<span>
													{suggestion.firstName} {suggestion.lastName}
												</span>
												<br />
												<span>{suggestion.userName}</span>
											</div>
										</div>
										<div className={styles.middle}>
											<div className={styles.bio}>
												<span>{suggestion.biographie}</span>
											</div>
										</div>
										<div className={styles.right}>
											<FollowButton idToFollow={suggestion._id} />
										</div>
									</div>
								);
							})}
							<div className={styles.load}>
								<div id="loader" ref={ref}>
									{isLoading && (
										<>
											<div></div>
											<div></div>
										</>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			<div id="overlay" onClick={(e) => setMore(false)}></div>
		</>
	);
}
