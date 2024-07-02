"use server";
import { getBlockedUsers } from "@/api/user/user";
import { checkIfEmpty } from "@/libs/utils";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/pages/block.module.css";
import Image from "next/image";
import Link from "next/link";
import Unblock from "@/components/blocks/Unblock";

export default async function block() {
	const blockedUsers = await getBlockedUsers();

	console.log(blockedUsers);
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.icon}>
					<Link href={"/user/settings/privacy-security"}>
						<FontAwesomeIcon icon={faArrowLeft} />
					</Link>
				</div>
				<span>Les utilisateurs bloqués</span>
			</div>
			{!checkIfEmpty(blockedUsers) ? (
				blockedUsers?.map((user) => {
					console.log(user._id);
					return (
						<div className={styles.wrapper} key={user?._id}>
							<div>
								<Image
									src={user?.picture ?? "/images/profil/default-pfp.jpg"}
									alt="picture"
									width={60}
									height={60}
									quality={100}
									className={styles.picture}
								/>
								<div className={styles.userInfo}>
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
								<Unblock idToUnblock={user?._id} text={false} />
							</div>
						</div>
					);
				})
			) : (
				<div className={styles.empty}>
					<span>
						Les utilisateurs bloqués apparaîtront ici, ils seront incapables de
						voir votre profil, vos posts, de commenter, ou de vous contacter.
					</span>
				</div>
			)}
		</div>
	);
}
