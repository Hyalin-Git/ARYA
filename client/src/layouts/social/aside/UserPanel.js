"use client";
import Image from "next/image";
import styles from "@/styles/layouts/social/aside/userPanel.module.css";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
import { montserrat } from "@/libs/fonts";

export default function UserPanel({ fetchedUser }) {
	const { user, uid } = useContext(AuthContext);
	const pathname = usePathname();
	let userInfo = fetchedUser ?? user;
	const isAuthor = userInfo._id === uid;
	const isUserPage = pathname.includes("/@");

	const userCreatedAt = moment(user.createdAt).locale("fr").format("D MMMM Y");
	// const hasSocialMedia = false;

	return (
		<Link className={styles.link} href={`/user/${userInfo?.userName}`}>
			<div className={styles.container}>
				<div className={styles.background}></div>
				<div className={styles.image}>
					<Image
						src={
							userInfo.picture
								? userInfo.picture
								: "/images/profil/default-pfp.jpg"
						}
						alt="profil"
						width={70}
						height={70}
						quality={100}
					/>
				</div>
				<div className={styles.names}>
					<span>
						{userInfo?.firstName} {userInfo?.lastName}
					</span>
					<span> {userInfo?.userName}</span>
				</div>
				<div className={styles.bio}>
					<p>{userInfo?.biographie || "Hello ! Je suis nouveau sur Arya"}</p>
				</div>
				{!isAuthor && isUserPage && (
					<div className={styles.buttons}>
						<button className={montserrat.className}>Suivre</button>
						<button className={montserrat.className}>Message</button>
					</div>
				)}
				<div className={styles.horizontal}></div>
				<div className={styles.follow}>
					<div className={styles.following}>
						<span>{userInfo?.following?.length}</span>
						<span>Following</span>
					</div>
					<div className={styles.line}></div>
					<div className={styles.followers}>
						<span>{userInfo?.followers?.length}</span>
						<span>Followers</span>
					</div>
				</div>
				<div className={styles.horizontal}></div>
				<div className={styles.footer}>
					{!isUserPage ? (
						<Link className={styles.link} href={`/user/${userInfo?.userName}`}>
							<button>Mon profil</button>
						</Link>
					) : (
						<span>Membre depuis le : {userCreatedAt}</span>
					)}
				</div>
			</div>
		</Link>
	);
}
