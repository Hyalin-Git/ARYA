"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/userStep.module.css";
import clsx from "clsx";
import { useState } from "react";
import { userStepValidation } from "@/libs/utils";

export default function UserStep({ step, setStep }) {
	const [isHide, setIsHide] = useState(false);

	function handleShowHidePassowrd(e) {
		e.preventDefault();
		const element = e.currentTarget;
		const passwordInput = element.previousElementSibling;
		passwordInput.focus();
		setIsHide(!isHide);
	}

	function handleForm(e) {
		e.preventDefault();
		const steps = e.target.parentElement.parentElement;
		const validation = userStepValidation();
		if (!validation) {
			return;
		}
		setStep(step + 1);
		const nextStep = steps.nextElementSibling;
		steps.style.display = "none";
		nextStep.style.display = "block";
	}
	return (
		<>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté </h1>
				<h2>Entrez vos coordonnées pour créer votre compte</h2>
			</div>
			<div className={styles.form}>
				<div className={styles.names}>
					<div>
						<label htmlFor="lastname">Nom</label>
						<span>*</span>
						<input
							className={clsx(montserrat.className, styles.lastname)}
							type="text"
							name="lastname"
							id="lastname"
							placeholder="Nom"
							minLength={2}
							maxLength={16}
							required
						/>
					</div>
					<div>
						<label htmlFor="firstname">Prénom</label>
						<span>*</span>
						<input
							className={clsx(montserrat.className, styles.firstname)}
							type="text"
							name="firstname"
							id="firstname"
							placeholder="Prénom"
							required
						/>
					</div>
				</div>
				<br />
				<label htmlFor="username">Nom d'utilisateur</label>
				<span>*</span>
				<br />
				<input
					className={clsx(montserrat.className, styles.username)}
					type="text"
					name="username"
					id="username"
					placeholder="utilisateur"
					required
				/>
				<br />
				<br />
				<label htmlFor="email">Adresse mail</label>
				<span>*</span>
				<br />
				<input
					className={clsx(montserrat.className, styles.email)}
					type="email"
					name="email"
					id="email"
					placeholder="example@email.com"
					required
				/>
				<br />
				<br />
				<label htmlFor="password">Mot de passe</label>
				<span>*</span>
				<br />
				<input
					className={clsx(montserrat.className, styles.password)}
					type={isHide ? "text" : "password"}
					name="password"
					id="password"
					placeholder="Au moins 8 caractères"
					required
				/>
				<div className={styles.visible} onClick={handleShowHidePassowrd}>
					<Image
						src={
							isHide
								? "/images/icons/eye-slash_icon.svg"
								: "/images/icons/eye_icon.svg"
						}
						width={20}
						height={20}
						alt="eye logo"
					/>
				</div>
				<br />
				<br />

				<label htmlFor="newPassword">Confirmez votre mot de passe</label>
				<span>*</span>
				<br />
				<input
					className={clsx(montserrat.className, styles.password)}
					type={isHide ? "text" : "password"}
					name="newPassword"
					id="newPassword"
					placeholder="Confirmez votre mot de passe"
					required
				/>
				<div className={styles.visible} onClick={handleShowHidePassowrd}>
					<Image
						src={
							isHide
								? "/images/icons/eye-slash_icon.svg"
								: "/images/icons/eye_icon.svg"
						}
						width={20}
						height={20}
						alt="eye logo"
					/>
				</div>
				<br />
				<br />
			</div>
			<div className={styles.button}>
				<button onClick={handleForm} className={montserrat.className}>
					Rejoindre la communauté
				</button>
			</div>
		</>
	);
}
