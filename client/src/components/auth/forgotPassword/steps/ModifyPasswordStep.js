import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/forgotPassword.module.css";
import clsx from "clsx";
import NewPassSubmit from "../NewPassSubmit";
import { useFormState } from "react-dom";
import { updateForgotPassword } from "@/actions/user";
import { useEffect, useState } from "react";
import Image from "next/image";
import PopUp from "@/components/popup/PopUp";

export default function ModifyPasswordStep({ setStep }) {
	const [isHide, setIsHide] = useState(false);
	const [showPopUp, setShowPopUp] = useState(false);
	const initialState = {
		isFailure: false,
		isSuccess: false,
		isPassword: false,
		message: "",
	};
	const [state, formAction] = useFormState(updateForgotPassword, initialState);

	function handleShowHidePassowrd(e) {
		e.preventDefault();
		const element = e.currentTarget;
		const passwordInput = element.previousElementSibling;
		passwordInput.focus();
		setIsHide(!isHide);
	}

	useEffect(() => {
		if (state?.isSuccess) {
			setStep(4);
		}

		if (state?.isFailure) {
			setShowPopUp(true);
			const timeout = setTimeout(() => {
				setShowPopUp(false);
			}, 4000);
			if (showPopUp) {
				clearTimeout(timeout);
			}
		}
	}, [state]);
	return (
		<>
			{!state.isSuccess ? (
				<>
					<div className={styles.titles}>
						<h1>Réinitialisez votre mot de passe</h1>
						<h2>Entrez votre nouveau mot de passe</h2>
					</div>
					<div className={styles.form}>
						<form action={formAction}>
							<div className={styles.labels}>
								<div>
									<label htmlFor="newPassword">Nouveau mot de passe</label>
								</div>
								<div>
									{state.isPassword && (
										<i className={styles.errorMsg}>Mot de passe invalide</i>
									)}
									<i className={styles.errorMsg} id="newPassword-error"></i>
								</div>
							</div>
							<input
								className={clsx(montserrat.className, styles.password)}
								type={isHide ? "text" : "password"}
								name="newPassword"
								id="newPassword"
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
							<div className={styles.labels}>
								<div>
									<label htmlFor="confirmNewPassword">
										Confirmez votre mot de passe
									</label>
								</div>
								<div>
									<i
										className={styles.errorMsg}
										id="confirmNewPassword-error"></i>
								</div>
							</div>
							<input
								className={clsx(montserrat.className, styles.password)}
								type={isHide ? "text" : "password"}
								name="confirmNewPassword"
								id="confirmNewPassword"
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
							<NewPassSubmit state={state} />
						</form>
					</div>
					{showPopUp && (
						<PopUp
							status={"failure"}
							title={"Une erreur est survenu"}
							message={state?.message}
						/>
					)}
				</>
			) : (
				<>
					{state.isSuccess && (
						<>
							<div className={styles.titles}>
								<h2 className={styles.successTitle}>
									Mot de passe rénitialiser avec succès !
								</h2>
								<h3 className={styles.successSubtitle}>
									Vous pouvez profiter à nouveau de Arya
								</h3>
							</div>
							<div className={styles.successBtn}>
								<button>Parfait</button>
							</div>
						</>
					)}
				</>
			)}
		</>
	);
}
