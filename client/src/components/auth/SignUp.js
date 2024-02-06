"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signUp.module.css";
import { useState } from "react";
import createUser from "@/actions/createUser";
import { COOKIE_NAME_PRERENDER_BYPASS } from "next/dist/server/api-utils";
import StepOne from "./StepOne";
import clsx from "clsx";

export default function SignUp({ setIsSignUp, setIsSignIn }) {
	const [isHide, setIsHide] = useState(false);
	function handleShowHidePassowrd(e) {
		e.preventDefault();
		const element = e.currentTarget;
		const passwordInput = element.previousElementSibling;

		passwordInput.focus();
		setIsHide(!isHide);
	}

	function handleSignIn() {
		setIsSignUp(false);
		setIsSignIn(true);
	}

	function handleForm(e) {
		e.preventDefault();
		const step = document.getElementById("step-0");
		const nextStep = document.getElementById("step-1");

		step.style.display = "none";
		nextStep.style.display = "block";
	}
	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<form action={createUser}>
					<div className={styles.steps} data-step="0" id="step-0">
						<div className={styles.titles}>
							<h1>Rejoignez la communauté </h1>
							<h2>Entrez vos coordonnées pour créer votre compte</h2>
						</div>
						<div className={styles.names}>
							<div>
								<label htmlFor="lastname">Nom</label>
								<input
									className={montserrat.className}
									type="text"
									name="lastname"
									id="lastname"
									placeholder="Nom"
								/>
							</div>
							<div>
								<label htmlFor="firstname">Prénom</label>
								<input
									className={montserrat.className}
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
							className={montserrat.className}
							type="text"
							name="username"
							id="username"
							placeholder="@utilisateur"
						/>
						<br />
						<br />
						<label htmlFor="email">Adresse mail</label>
						<br />
						<input
							className={montserrat.className}
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
							className={montserrat.className}
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
						<label htmlFor="password">Vérifiez votre mot de passe</label>
						<br />
						<input
							className={montserrat.className}
							type={isHide ? "text" : "password"}
							name="password"
							id="password"
							placeholder="Retapez votre mot de passe"
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
						<button
							onClick={handleForm}
							className={clsx(montserrat.className, styles.main)}>
							Rejoindre la communauté
						</button>
					</div>
					<div className={styles.steps} data-step="1" id="step-1">
						<StepOne />
					</div>

					{/* <div className={styles.steps} data-step="2" id="step-2">
						d
					</div>
					<div className={styles.steps} data-step="3" id="step-3">
						d
					</div> */}
				</form>
			</div>
			<div className={styles.text}>
				<p>
					Vous avez déjà un compte ?{" "}
					<span onClick={handleSignIn}>Se connecter</span>
				</p>
			</div>
		</div>
	);
}
