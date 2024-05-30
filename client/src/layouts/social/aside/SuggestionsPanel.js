"use client";
import styles from "@/styles/layouts/social/aside/followPanel.module.css";
import Image from "next/image";
import FollowButton from "@/components/social/FollowButton";
import { useState } from "react";
import MoreSuggestions from "../../../components/social/modals/MoreSuggestions";
export default function FollowPanel({ suggestions }) {
	const [more, setMore] = useState(false);
	return (
		<div className={styles.container} id="panel">
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
				<span
					onClick={(e) => {
						e.preventDefault();
						setMore(true);
					}}>
					Voir plus
				</span>
			</div>
			{more && <MoreSuggestions setMore={setMore} />}
		</div>
	);
}
