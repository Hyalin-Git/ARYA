"use client";
import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signIn.module.css";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { logIn } from "@/actions/auth";
import Submit from "./Submit";
import clsx from "clsx";
import { AuthContext } from "@/context/auth";
import { redirect } from "next/navigation";

export default function SignIn({
	setIsSignIn,
	setIsSignUp,
	setIsForgotPassword,
}) {
	const [isEmailError, setIsEmailError] = useState(false);
	const [isPasswordError, setIsPasswordError] = useState(false);
	const [isHide, setIsHide] = useState(false);
	const initialState = {
		isSuccess: false,
		isFailure: false,
		isEmail: false,
		isPassword: false,
		message: "",
	};
	const [state, formAction] = useFormState(logIn, initialState)

	useEffect(() => {
		if (state?.isEmail === true) {
			setIsPasswordError(false);
			setIsEmailError(true);
			document.getElementById("password").classList.remove(styles.error);
			document.getElementById("email").classList.add(styles.error);
		}
		if (state?.isPassword === true) {
			setIsEmailError(false);
			setIsPasswordError(true);
			document.getElementById("email").classList.remove(styles.error);
			document.getElementById("password").classList.add(styles.error);
		}
	}, [state]);

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

	function handleForgotPassword() {
		setIsForgotPassword(true);
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
					<div className={styles.labels}>
						<div>
							<label htmlFor="email">Adresse mail</label>
						</div>
						<div>
							{isEmailError && (
								<i className={styles.errorMsg}>{state.message}</i>
							)}
							<i className={styles.errorMsg} id="email-error"></i>
						</div>
					</div>
					<input
						onChange={(e) => {
							setIsEmailError(false);
							e.target.classList.remove(styles.error);
						}}
						className={clsx(montserrat.className, styles.email)}
						type="email"
						name="email"
						id="email"
						placeholder="example@email.com"
					/>

					<br />
					<br />
					<div className={styles.labels}>
						<div>
							<label htmlFor="password">Mot de passe </label>
						</div>
						<div>
							{isPasswordError && (
								<i className={styles.errorMsg}>{state.message}</i>
							)}
							<i className={styles.errorMsg} id="password-error"></i>
						</div>
					</div>
					<input
						onChange={(e) => {
							setIsPasswordError(false);
							e.target.classList.remove(styles.error);
						}}
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

					<div className={styles.forgotPassword}>
						<span onClick={handleForgotPassword}>Mot de passe oublié ?</span>
					</div>
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
