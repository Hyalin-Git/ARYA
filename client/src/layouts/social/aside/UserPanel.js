"use client";
import Image from "next/image";
import styles from "@/styles/layouts/social/aside/userPanel.module.css";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
import { montserrat } from "@/libs/fonts";

export default function UserPanel({ fetchedUser }) {
	const router = useRouter();
	const { user, uid } = useContext(AuthContext);
	const pathname = usePathname();
	let userInfo = fetchedUser ?? user;

	const isAuthor = userInfo._id === uid;
	const isUserPage = pathname.includes("/@");

	const userCreatedAt = moment(user.createdAt).locale("fr").format("D MMMM Y");
	// const hasSocialMedia = false;
	const hasWebsite = userInfo?.website;

	return (
		<Link className={styles.link} href={`/user/${userInfo?.userName}/posts`}>
			<div className={styles.container} id="panel">
				{isAuthor && (
					<div className={styles.settings}>
						<Link href={"/user/settings"}>
							<Image
								src="/images/icons/setting_icon.svg"
								alt="settings"
								width={25}
								height={25}
							/>
						</Link>
					</div>
				)}
				<div className={styles.profil}>
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
					<div className={styles.job}>
						<span>Développeur web full-stack</span>
					</div>
					{hasWebsite && (
						<div className={styles.website}>
							<Link href={userInfo?.website}>{userInfo?.website}</Link>
						</div>
					)}
					{!isAuthor && isUserPage && (
						<div className={styles.buttons}>
							<button className={montserrat.className}>Suivre</button>
							<button className={montserrat.className}>Message</button>
						</div>
					)}
				</div>
				{/* USER INFO  */}
				<div className={styles.userInfo}>
					<div>
						<div className={styles.horizontal}></div>
						<div className={styles.stats}>
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
					</div>
					{isUserPage && (
						<>
							<div className={styles.team}>
								<div>
									<span>Entreprise</span>
								</div>
								<div className={styles.content}>
									<p>Gaycorp</p>
								</div>
							</div>
							<div className={styles.bio}>
								<div>
									<span>à propos de moi</span>
								</div>
								<div className={styles.content}>
									<p>
										{userInfo?.biographie || "Hello ! Je suis nouveau sur Arya"}
									</p>
								</div>
							</div>
							<div className={styles.contact}>
								<div>
									<span>Me contacter</span>
								</div>
								<div className={styles.content}>
									<p>nicolas.tombal01@gmail.com</p>
								</div>
							</div>
							<div className={styles.social}>
								<div>
									<span>Mes réseaux</span>
								</div>
								<div className={styles.content}>
									<ul>
										<li>Twitter</li>
										<li>Instagram</li>
										<li>LinkedIn</li>
									</ul>
								</div>
							</div>
							<div className={styles.tools}>
								<div>
									<span>Mes Outils</span>
								</div>
								<div className={styles.content}>
									<ul>
										<li>Twitter</li>
										<li>Instagram</li>
										<li>LinkedIn</li>
									</ul>
								</div>
							</div>
						</>
					)}
					<div className={styles.date}>
						<span>Membre depuis le : {userCreatedAt}</span>
					</div>
					{!isAuthor && (
						<div className={styles.reports}>
							<span>Signaler</span>
							<span>Bloquer</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
