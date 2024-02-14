"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signIn.module.css";
import { useState } from "react";
import { useFormState } from "react-dom";
import { logIn } from "@/actions/auth";
import Submit from "./Submit";
import clsx from "clsx";

export default function SignIn({ setIsSignIn, setIsSignUp }) {
	const [isHide, setIsHide] = useState(false);
	const initialState = {
		isEmail: false,
		isPassword: false,
		message: "",
	};
	const [state, formAction] = useFormState(logIn, initialState);

	function handleShowHidePassowrd(e) {
		e.preventDefault();
		const element = e.currentTarget;
		const passwordInput = element.previousElementSibling;

		passwordInput.focus();
		setIsHide(!isHide);
	}

	function handleSignUp() {
		setIsSignUp(true);
		setIsSignIn(false);
	}

	return (
		<div className={styles.container}>
			<div className={styles.titles}>
				<h1>Connectez-vous</h1>
				<h2>Entrez vos coordonnées pour accéder à votre compte</h2>
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<label htmlFor="email">Adresse mail</label>
					<br />
					<input
						className={clsx(montserrat.className, styles.email)}
						type="email"
						name="email"
						id="email"
						placeholder="example@email.com"
					/>
					{state?.isEmail && <i className={styles.errorMsg}>{state.message}</i>}
					<br />
					<br />
					<label htmlFor="password">Mot de passe </label>
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
					{state?.isPassword && (
						<>
							<i className={styles.errorMsg}>{state.message}</i>
							<br />
						</>
					)}
					<br />
					<br />
					<Submit />
				</form>
			</div>
			<div className={styles.text}>
				<p>
					Vous n'avez pas de compte ?{" "}
					<span onClick={handleSignUp}>Créer un compte</span>
				</p>
			</div>
		</div>
	);
}
