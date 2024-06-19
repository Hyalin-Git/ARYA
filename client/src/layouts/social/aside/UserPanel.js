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
import { capitalizeFirstLetter } from "@/libs/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function UserPanel({ fetchedUser }) {
	const router = useRouter();
	const { user, uid } = useContext(AuthContext);
	const pathname = usePathname();
	let userInfo = fetchedUser ?? user;

	console.log(userInfo);

	const isAuthor = userInfo._id === uid;
	const isUserPage = pathname.includes("/@");

	const hasCompany = userInfo?.company;

	// User related
	const userCreatedAt = moment(user.createdAt).locale("fr").format("D MMMM Y");
	const hasWebsite = userInfo?.website;
	const hasContact = userInfo?.contact;
	const hasSocialMedia =
		userInfo?.social?.twitter ||
		userInfo?.social?.tiktok ||
		userInfo?.social?.instagram ||
		userInfo?.social?.facebook ||
		userInfo?.social?.linkedIn ||
		userInfo?.social?.youtube ||
		userInfo?.social?.twitch;
	const hasTools = userInfo?.tools;

	// Freelance related
	const hasCv = userInfo?.freelance?.cv?.pdf;
	const cvIsPublic = userInfo?.freelance?.cv?.private;
	const isLookingForJob = userInfo?.freelance?.lookingForJob;
	const hasAvailability = userInfo?.freelance?.availability;
	const availabilityDate = moment().to(hasAvailability);
	const hasPassed = availabilityDate.includes("il y a");
	console.log(hasPassed);

	return (
		<div className={styles.container} id="panel">
			<Link
				href={`/user/${userInfo?.userName}/posts`}
				data-disabled={fetchedUser ? true : false}>
				{isAuthor && (
					<div className={styles.settings}>
						<Link href={"/user/settings"} data-disabled={false}>
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
						<span>{userInfo?.job}</span>
					</div>
					{hasWebsite && (
						<div className={styles.website}>
							<Link href={userInfo?.website} data-disabled={false}>
								{userInfo?.website}
							</Link>
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
							{hasCompany && (
								<div className={styles.team}>
									<div>
										<span>Entreprise</span>
									</div>
									<div className={styles.content}>
										<div>
											<Image
												src={userInfo?.company?.logo}
												alt="logo"
												width={40}
												height={40}
											/>
											<div className={styles.companyInfo}>
												<span>{userInfo?.company?.name}</span>
												<span>{userInfo?.company?.activity}</span>
											</div>
										</div>
										<div>
											<span>
												{userInfo?.company?.members?.length + 1} membres
											</span>
										</div>
									</div>
								</div>
							)}

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
							{hasContact && (
								<div className={styles.contact}>
									<div>
										<span>Me contacter</span>
									</div>
									<div className={styles.content}>
										<p>{userInfo.contact}</p>
									</div>
								</div>
							)}
							{hasSocialMedia && (
								<div className={styles.social}>
									<div>
										<span>Mes réseaux</span>
									</div>
									<div className={styles.content}>
										<ul>
											{userInfo?.social?.twitter && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.twitter}>
														<Image
															src="/images/icons/x_icon.svg"
															alt="icon"
															width={30}
															height={28}
														/>
														Twitter
													</Link>
												</li>
											)}

											{userInfo?.social?.tiktok && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.tiktok}>
														<Image
															src="/images/icons/tiktok_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														Tiktok
													</Link>
												</li>
											)}

											{userInfo?.social?.instagram && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.instagram}>
														<Image
															src="/images/icons/instagram_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														Instagram
													</Link>
												</li>
											)}

											{userInfo?.social?.facebook && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.facebook}>
														<Image
															src="/images/icons/facebook_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														Facebook
													</Link>
												</li>
											)}
											{userInfo?.social?.linkedIn && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.linkedIn}>
														<Image
															src="/images/icons/linkedIn_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														LinkedIn
													</Link>
												</li>
											)}
											{userInfo?.social?.youtube && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.youtube}>
														<Image
															src="/images/icons/youtube_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														Youtube
													</Link>
												</li>
											)}
											{userInfo?.social?.twitch && (
												<li>
													<Link
														data-disabled={false}
														href={userInfo?.social?.twitch}>
														<Image
															src="/images/icons/twitch_icon.svg"
															alt="icon"
															width={30}
															height={30}
														/>
														Twitch
													</Link>
												</li>
											)}
										</ul>
									</div>
								</div>
							)}
							{hasTools[0] && (
								<div className={styles.tools}>
									<div>
										<span>Mes Outils</span>
									</div>
									<div className={styles.content}>
										<ul>
											{userInfo.tools.map((tool, idx) => {
												return <li key={idx}>{tool}</li>;
											})}
										</ul>
									</div>
								</div>
							)}
							{isLookingForJob && hasAvailability && (
								<div className={styles.availability}>
									<div>
										<span>Disponibilité</span>
									</div>
									<div className={styles.content}>
										<FontAwesomeIcon icon={faBusinessTime} />
										<div>
											<p>
												Recruter <span>{userInfo?.userName}</span>
											</p>
											<span>
												Disponible {hasPassed ? "" : availabilityDate}
											</span>
										</div>
									</div>
								</div>
							)}
							{hasCv && !cvIsPublic && (
								<div className={styles.cv}>
									<button
										className={montserrat.className}
										data-disabled={false}>
										{isAuthor ? "Télécharger mon CV" : "Télécharger le CV"}
									</button>
								</div>
							)}
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
			</Link>
		</div>
	);
}
