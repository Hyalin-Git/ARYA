"use client";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/userEditor.module.css";
import Image from "next/image";
import { useContext } from "react";
export default function UserEditor() {
	const { user } = useContext(AuthContext);
	return (
		<div className={styles.container} id="panel">
			<div className={styles.userInfo}>
				<div>
					<span>Informations de l'utilisateur</span>
				</div>
				<form action="">
					<div className={styles.form}>
						<div>
							<Image
								src={user.picture}
								width={100}
								height={100}
								quality={100}
								alt="profil picture"
								style={{
									borderRadius: "50%",
								}}
							/>
							<br />
							<span>Changer ma photo de profil</span>
						</div>
						<div>
							<div className={styles.names}>
								<div>
									<label htmlFor="lastname">Nom</label>
									<br />
									<input
										type="text"
										name="lastname"
										id="lastname"
										className={montserrat.className}
										defaultValue={user.lastName}
									/>
								</div>
								<div>
									<label htmlFor="firstname">Prénom</label>
									<br />
									<input
										type="text"
										name="firstname"
										id="firstname"
										className={montserrat.className}
										defaultValue={user.firstName}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="username">Nom d'utilisateur</label>
								<br />
								<input
									type="text"
									name="username"
									id="username"
									className={montserrat.className}
									defaultValue={user.userName}
								/>
							</div>
							<div>
								<label htmlFor="job">Profession</label>
								<br />
								<input
									type="text"
									name="job"
									id="job"
									className={montserrat.className}
									defaultValue={user?.job}
								/>
							</div>
							<div>
								<label htmlFor="bio">Biographie</label>
								<br />
								<textarea
									type="text"
									name="bio"
									id="bio"
									className={montserrat.className}
									onChange={(e) => {
										e.preventDefault();
										e.target.style.height = "";
										e.target.style.height = e.target.scrollHeight + "px";
									}}
									defaultValue={user?.biographie}
								/>
							</div>
							<div>
								<label htmlFor="username">URL du site web</label>
								<br />
								<input
									type="text"
									name="username"
									id="username"
									className={montserrat.className}
									defaultValue={user?.website}
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
