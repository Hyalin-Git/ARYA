"use server";
import { getBlockedUsers } from "@/api/user/user";
import { checkIfEmpty } from "@/libs/utils";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/pages/block.module.css";
import Image from "next/image";

export default async function block() {
	const blockedUsers = await getBlockedUsers();

	console.log(blockedUsers);
	return (
		<div className={styles.container}>
			{!checkIfEmpty(blockedUsers) ? (
				blockedUsers?.map((user) => {
					return (
						<div className={styles.wrapper}>
							<div>
								<Image
									src={user?.picture ?? "/images/profil/default-pfp.jpg"}
									alt="picture"
									width={60}
									height={60}
									quality={100}
									className={styles.picture}
								/>
								<div>
									<span className={styles.names}>
										{user?.firstName + " " + user?.lastName}
									</span>
									<br />
									<span className={styles.username}>{user?.userName}</span>
								</div>
							</div>
							<div>
								<span className={styles.bio}>{user?.biographie}</span>
							</div>
							<div>
								<form action="">
									<button type="submit">
										<FontAwesomeIcon icon={faBan} />
									</button>
								</form>
							</div>
						</div>
					);
				})
			) : (
				<div className={styles.empty}>
					<span>Les utilisateurs bloqués apparaîtront ici</span>
				</div>
			)}
		</div>
	);
}
