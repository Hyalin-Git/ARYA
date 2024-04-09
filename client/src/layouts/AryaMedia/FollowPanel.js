import styles from "@/styles/components/aryaMedia/followPanel.module.css";
import { getUsers } from "@/api/user/user";
import Image from "next/image";
import FollowButton from "@/components/AryaMedia/FollowButton";
export default async function FollowPanel() {
	"use server";
	const users = await getUsers("", 3);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span>Personnes ayant les mêmes centres d'intérêt</span>
			</div>
			<div className={styles.content}>
				{users.map((user) => {
					return (
						<div className={styles.users} key={user._id}>
							<div>
								<Image
									src={
										user.picture
											? user.picture
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
									{user.firstName} {user.lastName}
								</span>
								<br />
								<span className={styles.username}>{user.userName}</span>
							</div>
							<div>
								<FollowButton idToFollow={user._id} />
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
