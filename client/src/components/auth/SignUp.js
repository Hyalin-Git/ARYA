"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signUp.module.css";
import { useState } from "react";

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
	return (
		<div className={styles.container}>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté </h1>
				<h2>Entrez vos coordonnées pour créer votre compte</h2>
			</div>
			<div className={styles.form}>
				<form action="">
					<div className={styles.names}>
						<div className={styles.d}>
							<label htmlFor="lastname">Nom</label>
							<input
								className={montserrat.className}
								type="text"
								name="lastname"
								id="lastname"
							/>
						</div>
						<div>
							<label htmlFor="firstname">Prénom</label>
							<input
								className={montserrat.className}
								type="text"
								name="firstname"
								id="firstname"
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
					<button type="submit" className={montserrat.className}>
						Rejoindre la communauté
					</button>
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
