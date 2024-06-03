"use client";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/socialEditor.module.css";
import Image from "next/image";
import { useContext } from "react";
export default function SocialEditor() {
	const { user } = useContext(AuthContext);
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Réseau social</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="twitter">
						<Image
							src="/images/icons/x_icon.svg"
							alt="icon"
							width={30}
							height={28}
						/>
					</label>
					<input
						type="text"
						name="twitter"
						id="twitter"
						className={montserrat.className}
						defaultValue={user?.social?.twitter}
					/>
				</div>
				<div>
					<label htmlFor="tiktok">
						<Image
							src="/images/icons/tiktok_icon.svg"
							alt="icon"
							width={30}
							height={30}
						/>
					</label>
					<input
						type="text"
						name="tiktok"
						id="tiktok"
						className={montserrat.className}
						defaultValue={user?.social?.tiktok}
					/>
				</div>
				<div>
					<label htmlFor="email">
						<Image
							src="/images/icons/instagram_icon.svg"
							alt="icon"
							width={30}
							height={30}
						/>
					</label>
					<input type="email" name="email" id="email" />
				</div>
				<div>
					<label htmlFor="email">
						<Image
							src="/images/icons/facebook_icon.svg"
							alt="icon"
							width={30}
							height={28}
						/>
					</label>
					<input type="email" name="email" id="email" />
				</div>
				<div>
					<label htmlFor="linkedIn">
						<Image
							src="/images/icons/linkedIn_icon.svg"
							alt="icon"
							width={30}
							height={30}
						/>
					</label>
					<input
						type="email"
						name="linkedIn"
						id="linkedIn"
						className={montserrat.className}
						defaultValue={user?.social?.linkedIn}
					/>
				</div>
				<div>
					<label htmlFor="email">
						<Image
							src="/images/icons/youtube_icon.svg"
							alt="icon"
							width={30}
							height={30}
						/>
					</label>
					<input type="email" name="email" id="email" />
				</div>
				<div>
					<label htmlFor="email">
						<Image
							src="/images/icons/twitch_icon.svg"
							alt="icon"
							width={30}
							height={30}
						/>
					</label>
					<input type="email" name="email" id="email" />
				</div>
			</div>
		</div>
	);
}
