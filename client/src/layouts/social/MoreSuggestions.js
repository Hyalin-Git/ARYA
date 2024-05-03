import styles from "@/styles/layouts/social/moreSuggestions.module.css";
import { getFollowSuggestions } from "@/api/user/user";
import useSWR from "swr";
import Image from "next/image";
import FollowButton from "@/components/social/FollowButton";

export default function MoreSuggestions({ setMore }) {
	const getSuggestionsWithLimit = getFollowSuggestions.bind(null, 10);
	const { data, error, isLoading } = useSWR(
		`users/suggestion/`,
		getSuggestionsWithLimit
	);
	console.log(data);
	return (
		<>
			<div className={styles.container}>
				<div>
					<Image
						src={"/images/icons/uncheck_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => setMore(false)}
					/>
				</div>
				<div className={styles.header}>
					<span>Personnes ayant les mêmes centres d'intérêt</span>
				</div>
				<div className={styles.content}>
					{isLoading ? (
						<div>loader</div>
					) : (
						<>
							{data?.map((suggestion) => {
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
						</>
					)}
				</div>
			</div>
			<div id="overlay" onClick={(e) => setMore(false)}></div>
		</>
	);
}
