"use client";
import Image from "next/image";
import styles from "@/styles/components/aryaMedia/sendPostPanel.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";

export default function SendPostPanel() {
	const { user } = useContext(AuthContext);
	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<div>
					<Image
						src={user.picture ? user.picture : "/images/profil/default-pfp.jpg"}
						alt="profil"
						width={60}
						height={60}
						quality={100}
					/>
				</div>
				<div className={styles.text}>
					<input
						name="text"
						id="text"
						type="text"
						placeholder={`Quelque chose à partager aujourd'hui ${user?.userName} ?`}
						className={montserrat.className}></input>
				</div>
			</div>
			<div className={styles.list}>
				<ul>
					<li>
						<Image
							src="/images/icons/bell_icon.svg"
							width={25}
							height={25}
							alt="icon"
						/>
					</li>
					<li>
						{" "}
						<Image
							src="/images/icons/bell_icon.svg"
							width={25}
							height={25}
							alt="icon"
						/>
					</li>
					<li>
						{" "}
						<Image
							src="/images/icons/bell_icon.svg"
							width={25}
							height={25}
							alt="icon"
						/>
					</li>
					<li>
						{" "}
						<Image
							src="/images/icons/bell_icon.svg"
							width={25}
							height={25}
							alt="icon"
						/>
					</li>
				</ul>
			</div>
		</div>
	);
}
