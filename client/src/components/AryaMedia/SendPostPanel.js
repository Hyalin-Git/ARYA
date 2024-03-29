"use client";
import Image from "next/image";
import styles from "@/styles/components/aryaMedia/sendPostPanel.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { savePost } from "@/actions/post";

export default function SendPostPanel() {
	const { user } = useContext(AuthContext);
	const [isWriting, setIsWriting] = useState(false);
	return (
		<div className={styles.container} data-writing={isWriting}>
			<form action={savePost}>
				<div className={styles.form}>
					<div>
						<Image
							src={
								user.picture ? user.picture : "/images/profil/default-pfp.jpg"
							}
							alt="profil"
							width={50}
							height={50}
							quality={100}
						/>
					</div>

					<div className={styles.text}>
						<textarea
							onChange={(e) => {
								e.preventDefault();
								setIsWriting(true);
								if (e.target.value.length <= 0) {
									setIsWriting(false);
								}
							}}
							name="text"
							id="text"
							type="text"
							placeholder={`Quelque chose à partager aujourd'hui ${user?.userName} ?`}
							className={montserrat.className}
						/>
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.list}>
						<ul>
							<li>
								<Image
									src="/images/icons/img_icon.svg"
									width={20}
									height={20}
									alt="icon"
								/>
							</li>
							<li>
								{" "}
								<Image
									src="/images/icons/video_icon.svg"
									width={20}
									height={20}
									alt="icon"
								/>
							</li>
							<li>
								{" "}
								<Image
									src="/images/icons/gif_icon.svg"
									width={20}
									height={20}
									alt="icon"
								/>
							</li>
							<li>
								{" "}
								<Image
									src="/images/icons/clock_icon.svg"
									width={20}
									height={20}
									alt="icon"
								/>
							</li>
						</ul>
					</div>
					<div className={styles.button}>
						<button type="submit" className={clsx(montserrat.className)}>
							Poster
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
