"use client";
import { updateUser, updateUserPicture } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/userEditor.module.css";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { mutate } from "swr";
import { useDebouncedCallback } from "use-debounce";

const initialState = {
	status: "pending",
	message: "",
	error: [""],
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
	const errorlastName = stateOne?.error?.includes("lastName");
	const errorfirstName = stateOne?.error?.includes("firstName");
	const errorUsername = stateOne?.error?.includes("userName");
	const errorJob = stateOne?.error?.includes("job");
	const errorBio = stateOne?.error?.includes("biographie");
	const errorContact = stateOne?.error?.includes("contact");
	const errorWebsite = stateOne?.error?.includes("website");
	console.log(stateOne);
	useEffect(() => {
		if (stateOne?.status === "success") {
			mutate("/login/success");
		}
		if (stateTwo?.status === "success") {
			mutate("/login/success");
		}
	}, [stateOne, stateTwo]);

	const debounced = useDebouncedCallback((e) => {
		e.preventDefault();
		document.getElementById("user-info").requestSubmit();
	}, 1200);

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
						<form action={formAction} id="user-info">
							<div className={styles.names}>
								<div>
									<label htmlFor="lastName">Nom</label>
									<br />
									<input
										data-error={errorlastName}
										type="text"
										name="lastName"
										id="lastName"
										required
										className={montserrat.className}
										defaultValue={user.lastName}
										onChange={(e) => debounced(e)}
									/>
									{errorlastName && (
										<i data-error={errorlastName}>{stateOne?.message}</i>
									)}
								</div>
								<div>
									<label htmlFor="firstName">Prénom</label>
									<br />
									<input
										data-error={errorfirstName}
										type="text"
										name="firstName"
										id="firstName"
										required
										className={montserrat.className}
										defaultValue={user.firstName}
										onChange={(e) => debounced(e)}
									/>
									{errorfirstName && (
										<i data-error={errorfirstName}>{stateOne?.message}</i>
									)}
								</div>
							</div>
							<div>
								<label htmlFor="userName">Nom d'utilisateur</label>
								<br />
								<input
									data-error={errorUsername}
									type="text"
									name="userName"
									id="userName"
									required
									className={montserrat.className}
									defaultValue={user.userName?.split("@")[1]}
									onChange={(e) => debounced(e)}
								/>
								{errorUsername && (
									<i data-error={errorUsername}>{stateOne?.message}</i>
								)}
							</div>
							<div>
								<label htmlFor="job">Profession</label>
								<br />
								<input
									data-error={errorJob}
									type="text"
									name="job"
									id="job"
									className={montserrat.className}
									defaultValue={user?.job}
									onChange={(e) => debounced(e)}
								/>
								{errorJob && <i data-error={errorJob}>{stateOne?.message}</i>}
							</div>
							<div>
								<label htmlFor="biographie">Biographie</label>
								<br />
								<textarea
									data-error={errorBio}
									type="text"
									name="biographie"
									id="biographie"
									className={montserrat.className}
									onChange={(e) => {
										e.preventDefault();
										e.target.style.height = "";
										e.target.style.height = e.target.scrollHeight + "px";
										debounced(e);
									}}
									defaultValue={user?.biographie}
								/>
								{errorBio && <i data-error={errorBio}>{stateOne?.message}</i>}
							</div>
							<div>
								<label htmlFor="contact">Adresse mail de contact</label>
								<br />
								<input
									data-error={errorContact}
									type="text"
									name="contact"
									id="contact"
									className={montserrat.className}
									defaultValue={user?.contact}
									onChange={(e) => debounced(e)}
								/>
								{errorContact && (
									<i data-error={errorContact}>{stateOne?.message}</i>
								)}
							</div>
							<div>
								<label htmlFor="website">URL du site web</label>
								<br />
								<input
									data-error={errorWebsite}
									type="text"
									name="website"
									id="website"
									className={montserrat.className}
									defaultValue={user?.website}
									onChange={(e) => debounced(e)}
								/>
								{errorWebsite && (
									<i data-error={errorWebsite}>{stateOne?.message}</i>
								)}
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
