"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/userStep.module.css";
import clsx from "clsx";
import { useState } from "react";
import StepTracker from "./StepTracker";

export default function UserStep({ setStep }) {
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
		const step = e.target.parentElement.parentElement;
		console.log(step);
		const nextStep = step.nextElementSibling;
		setStep(2);
		step.style.display = "none";
		nextStep.style.display = "block";
	}
	return (
		<>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté </h1>
				<h2>Entrez vos coordonnées pour créer votre compte</h2>
			</div>

			<div className={styles.names}>
				<div>
					<label htmlFor="lastname">Nom</label>
					<input
						className={clsx(montserrat.className, styles.lastname)}
						type="text"
						name="lastname"
						id="lastname"
						placeholder="Nom"
					/>
				</div>
				<div>
					<label htmlFor="firstname">Prénom</label>
					<input
						className={clsx(montserrat.className, styles.firstname)}
						type="text"
						name="firstname"
						id="firstname"
						placeholder="Prénom"
					/>
				</div>
			</div>
			<br />
			<label htmlFor="username">Nom d'utilisateur</label>
			<br />
			<input
				className={clsx(montserrat.className, styles.username)}
				type="text"
				name="username"
				id="username"
				placeholder="utilisateur"
			/>
			<br />
			<br />
			<label htmlFor="email">Adresse mail</label>
			<br />
			<input
				className={clsx(montserrat.className, styles.email)}
				type="email"
				name="email"
				id="email"
				placeholder="example@email.com"
			/>
			<br />
			<br />
			<label htmlFor="password">Mot de passe</label>
			<br />
			<input
				className={clsx(montserrat.className, styles.password)}
				type={isHide ? "text" : "password"}
				name="password"
				id="password"
				placeholder="Au moins 8 caractères"
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
			<label htmlFor="password">Confirmez votre mot de passe</label>
			<br />
			<input
				className={clsx(montserrat.className, styles.password)}
				type={isHide ? "text" : "password"}
				name="password"
				id="password"
				placeholder="Confirmez votre mot de passe"
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

			<div className={styles.button}>
				<button onClick={handleForm} className={montserrat.className}>
					Rejoindre la communauté
				</button>
			</div>
		</>
	);
}
