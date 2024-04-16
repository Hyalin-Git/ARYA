"use client";
import Image from "next/image";
import styles from "@/styles/layouts/social/userPanel.module.css";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import Link from "next/link";

export default function UserPanel() {
	const { user, uid } = useContext(AuthContext);

	return (
		<div className={styles.container}>
			<div className={styles.background}></div>
			<div className={styles.image}>
				<Image
					src={user.picture ? user.picture : "/images/profil/default-pfp.jpg"}
					alt="profil"
					width={70}
					height={70}
					quality={100}
				/>
			</div>
			<div className={styles.names}>
				<span>
					{user?.firstName} {user?.lastName}
				</span>
				<span> {user?.userName}</span>
			</div>
			<div className={styles.bio}>
				<p>
					Ma super biographie de la mort qui tue qdzqdz qzod qzkozd koqz kdozq
					kdoqzd
				</p>
			</div>
			<div className={styles.follow}>
				<div className={styles.following}>
					<span>{user?.following?.length}</span>
					<span>Following</span>
				</div>
				<div className={styles.line}></div>
				<div className={styles.followers}>
					<span>{user?.followers?.length}</span>
					<span>Followers</span>
				</div>
			</div>
			<div className={styles.link}>
				<Link href="/profil">
					<button>Mon profil</button>
				</Link>
			</div>
		</div>
	);
}
