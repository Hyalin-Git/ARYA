"use server";
import styles from "@/styles/components/aryaMedia/followPanel.module.css";
import { getFollowSuggestions } from "@/api/user/user";
import Image from "next/image";
import FollowButton from "@/components/social/FollowButton";
export default async function FollowPanel() {
	const suggestions = await getFollowSuggestions();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span>Personnes ayant les mêmes centres d'intérêt</span>
			</div>
			<div className={styles.content}>
				{suggestions?.map((suggestion) => {
					return (
						<div className={styles.users} key={suggestion._id}>
							<div>
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
							</div>
							<div>
								<span className={styles.names}>
									{suggestion.firstName} {suggestion.lastName}
								</span>
								<br />
								<span className={styles.username}>{suggestion.userName}</span>
							</div>
							<div>
								<FollowButton idToFollow={suggestion._id} />
							</div>
						</div>
					);
				})}
			</div>
			<div className={styles.footer}>
				<span>Voir plus</span>
			</div>
		</div>
	);
}
