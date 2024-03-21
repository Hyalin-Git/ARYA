"use server";
import styles from "@/styles/components/aryaMedia/followPanel.module.css";
import { getUsers } from "@/api/user/user";
import Image from "next/image";
export default async function FollowPanel() {
	const users = await getUsers();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span>Personnes ayant les mêmes centres d'intérêt</span>
			</div>
			<div className={styles.content}>
				{users.map((user) => {
					// if (user._id !== "65e84d8f5b4447f020ca2746") {
					// }
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
								<button>Suivre</button>
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
