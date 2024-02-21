"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/userStep.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { userStepValidation } from "@/libs/utils";

export default function UserStep({ state, step, setStep }) {
	const [isHide, setIsHide] = useState(false);
	const [isLastname, setIsLastname] = useState(false);
	const [isFirstname, setIsFirstname] = useState(false);
	const [isUsername, setIsUsername] = useState(false);
	const [isEmail, setIsEmail] = useState(false);
	const [isPassword, setIsPassword] = useState(false);

	useEffect(() => {
		function resetStep() {
			const firstStep = document.getElementById("step-1");
			const secondStep = document.getElementById("step-2");
			const thirdStep = document.getElementById("step-3");

			firstStep.style.display = "block";
			secondStep.style.display = "none";
			thirdStep.style.display = "none";
			setStep(1);
		}
		if (state.isLastname === true) {
			setIsLastname(true);
			resetStep();
			state.isLastname = false;
		}
		if (state.isFirstname === true) {
			setIsFirstname(true);
			resetStep();
			state.isFirstname = false;
		}
		if (state.isUsername === true) {
			setIsUsername(true);
			resetStep();
			document.getElementById("username").classList.add(styles.error);
			state.isUsername = false;
		}
		if (state.isEmail === true) {
			setIsEmail(true);
			resetStep();
			document.getElementById("email").classList.add(styles.error);
			state.isEmail = false;
		}
		if (state.isPassword === true) {
			setIsPassword(true);
			resetStep();
			state.isPassword = false;
		}
	}, [step, state]);

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
						<div className={styles.labels}>
							<div>
								<label htmlFor="lastname">Nom</label>
								<span>*</span>
							</div>
							<div>
								{isLastname && (
									<>
										<i className={styles.errorMsg}>Nom invalide</i>
									</>
								)}
								<i className={clsx(styles.errorMsg)} id="lastname-error"></i>
							</div>
						</div>
						<input
							onChange={(e) => {
								setIsLastname(false);
								e.target.classList.remove(styles.error);
							}}
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
						<div className={styles.labels}>
							<div>
								<label htmlFor="firstname">Prénom</label>
								<span>*</span>
							</div>
							<div>
								{isFirstname && (
									<>
										<i className={styles.errorMsg}>Prénom invalide</i>
									</>
								)}
								<i className={clsx(styles.errorMsg)} id="firstname-error"></i>
							</div>
						</div>
						<input
							onChange={(e) => {
								setIsFirstname(false);
								e.target.classList.remove(styles.error);
							}}
							className={clsx(montserrat.className, styles.firstname)}
							type="text"
							name="firstname"
							id="firstname"
							placeholder="Prénom"
							minLength={2}
							maxLength={16}
							required
						/>
					</div>
				</div>
				<br />
				<div className={styles.labels}>
					<div>
						<label htmlFor="username">Nom d'utilisateur</label>
						<span>*</span>
					</div>
					<div>
						{isUsername && (
							<>
								<i className={styles.errorMsg}>{state.message}</i>
							</>
						)}
						<i className={clsx(styles.errorMsg)} id="username-error"></i>
					</div>
				</div>
				<input
					onChange={(e) => {
						e.target.classList.remove(styles.error);
						setIsUsername(false);
					}}
					className={clsx(montserrat.className, styles.username)}
					type="text"
					name="username"
					id="username"
					placeholder="Seul le tiret bas (_) est autorisé"
					required
				/>
				<br />
				<br />
				<div className={styles.labels}>
					<div>
						<label htmlFor="email">Adresse mail</label>
						<span>*</span>
					</div>
					<div>
						{isEmail && (
							<>
								<i className={styles.errorMsg}>{state.message}</i>
							</>
						)}
						<i className={clsx(styles.errorMsg)} id="email-error"></i>
					</div>
				</div>
				<input
					onChange={(e) => {
						setIsEmail(false);
						e.target.classList.remove(styles.error);
					}}
					className={clsx(montserrat.className, styles.email)}
					type="email"
					name="email"
					id="email"
					placeholder="example@email.com"
					required
				/>

				<br />
				<br />
				<div className={styles.labels}>
					<div>
						<label htmlFor="password">Mot de passe</label>
						<span>*</span>
					</div>
					<div>
						{isPassword && (
							<>
								<i className={styles.errorMsg}>Mot de passe invalide</i>
							</>
						)}
						<i className={clsx(styles.errorMsg)} id="password-error"></i>
					</div>
				</div>
				<input
					onChange={(e) => {
						setIsPassword(false);
						e.target.classList.remove(styles.error);
					}}
					className={clsx(montserrat.className, styles.password)}
					type={isHide ? "text" : "password"}
					name="password"
					id="password"
					placeholder=""
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
				<div className={styles.labels}>
					<div>
						<label htmlFor="newPassword">Confirmez votre mot de passe</label>
						<span>*</span>
					</div>
					<div>
						<i className={clsx(styles.errorMsg)} id="newPassword-error"></i>
					</div>
				</div>
				<input
					onChange={(e) => {
						e.target.classList.remove(styles.error);
					}}
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
