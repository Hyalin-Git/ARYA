"use client";
import { updateUser, updateUserPicture } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/userEditor.module.css";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { mutate } from "swr";

const initialState = {
	status: "pending",
	message: "",
};
export default function UserEditor() {
	const { user, uid } = useContext(AuthContext);
	const [isPicture, setIsPicture] = useState(false);
	const updateUserWithUid = updateUser.bind(null, uid);
	const updateUserPictureWithUid = updateUserPicture.bind(null, uid);
	const [stateOne, formAction] = useFormState(updateUserWithUid, initialState);
	const [stateTwo, formActionn] = useFormState(
		updateUserPictureWithUid,
		initialState
	);

	useEffect(() => {
		if (stateOne.status === "success") {
			mutate("/login/success");
		}
		if (stateTwo.status === "success") {
			mutate("/login/success");
		}
	}, [stateOne, stateTwo]);
	return (
		<div className={styles.container} id="user">
			<div className={styles.userInfo}>
				<div>
					<span>Informations de l'utilisateur</span>
				</div>

				<div className={styles.form}>
					<div>
						<form
							action={formActionn}
							onChange={(e) => {
								e.preventDefault();

								document.getElementById("picture-form").requestSubmit();
							}}
							id="picture-form">
							<Image
								src={
									user?.picture
										? user.picture
										: "/images/profil/default-pfp.jpg"
								}
								width={100}
								height={100}
								quality={100}
								alt="profil picture"
								style={{
									borderRadius: "50%",
								}}
							/>
							<br />
							<label htmlFor="picture">Changer ma photo de profil</label>
							<input type="file" id="picture" name="picture" hidden />
						</form>
					</div>
					<div>
						<form action={formAction}>
							<div className={styles.names}>
								<div>
									<label htmlFor="lastName">Nom</label>
									<br />
									<input
										type="text"
										name="lastName"
										id="lastName"
										className={montserrat.className}
										defaultValue={user.lastName}
									/>
								</div>
								<div>
									<label htmlFor="firstName">Prénom</label>
									<br />
									<input
										type="text"
										name="firstName"
										id="firstName"
										className={montserrat.className}
										defaultValue={user.firstName}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="userName">Nom d'utilisateur</label>
								<br />
								<input
									type="text"
									name="userName"
									id="userName"
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
								<label htmlFor="biographie">Biographie</label>
								<br />
								<textarea
									type="text"
									name="biographie"
									id="biographie"
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
								<label htmlFor="contact">Adresse mail de contact</label>
								<br />
								<input
									type="text"
									name="contact"
									id="contact"
									className={montserrat.className}
									defaultValue={user?.contact}
								/>
							</div>
							<div>
								<label htmlFor="website">URL du site web</label>
								<br />
								<input
									type="text"
									name="website"
									id="website"
									className={montserrat.className}
									defaultValue={user?.website}
								/>
							</div>
							<button hidden type="submit">
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
