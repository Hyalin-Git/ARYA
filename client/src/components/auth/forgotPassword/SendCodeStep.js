import { sendResetCode } from "@/actions/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/forgotPassword.module.css";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import PopUp from "@/components/popup/PopUp";

export default function SendCodeStep({
	setIsSignIn,
	setIsForgotPassword,
	setStep,
}) {
	const [isCodeSent, setIsCodeSent] = useState(false);
	const [showPopUp, setShowPopUp] = useState(false);
	const initialState = {
		isFailure: false,
		isSuccess: false,
		message: "",
	};
	const [state, formAction] = useFormState(sendResetCode, initialState);

	function handleSignIn() {
		setIsForgotPassword(false);
		setIsSignIn(true);
	}

	useMemo(() => {
		if (state.isSuccess) {
			setIsCodeSent(true);
		}
		if (state?.isSuccess || state?.isFailure) {
			setShowPopUp(true);
			const interval = setTimeout(() => {
				setShowPopUp(false);
			}, 4000);
			if (showPopUp) {
				clearTimeout(interval);
			}
		}
	}, [state]);

	return (
		<>
			<div className={styles.titles}>
				<h1>Vous avez oublié votre mot de passe ?</h1>
				<h2>Entrez votre adresse mail pour le modifier</h2>
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<div className={styles.labels}>
						<div>
							<label htmlFor="email">Adresse mail</label>
						</div>
						<div>
							<i className={styles.errorMsg}></i>
						</div>
					</div>
					<input
						className={clsx(montserrat.className, styles.email)}
						type="email"
						name="email"
						id="email"
						placeholder="example@email.com"
					/>
					<br />
					<br />
					<SendCodeSubmit
						state={state}
						isCodeSent={isCodeSent}
						setStep={setStep}
					/>
				</form>
			</div>
			<div className={styles.text}>
				<p>
					Ah ! Ça vous revient ?{" "}
					<span onClick={handleSignIn}>Se connecter</span>
				</p>
			</div>
			{showPopUp && (
				<PopUp
					status={state?.isSuccess ? "success" : "failure"}
					title={state?.isSuccess ? "Code envoyé" : "Une erreur est survenu"}
					message={state?.message}
				/>
			)}
		</>
	);
}

export function SendCodeSubmit({ state, isCodeSent, setStep }) {
	const [timer, setTimer] = useState(30);
	const { pending } = useFormStatus();

	function handleEnterCode(e) {
		e.preventDefault();
		document.getElementById("step-1").style.display = "none";
		document.getElementById("step-2").style.display = "block";
		setStep(2);
	}

	useEffect(() => {
		let interval;
		if (state?.isSuccess) {
			interval = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		}
		if (state?.isFailure) {
			setTimer(0);
			return;
		}
		if (timer === 0) {
			clearInterval(interval);
		}
	}, [state, timer]);

	return (
		<>
			{!isCodeSent ? (
				<button
					id="send-btn"
					className={clsx(montserrat.className, pending && "loading")}
					disabled={pending}
					type="submit">
					{pending ? "Envoi en cours" : "Envoyer le code"}
				</button>
			) : (
				<>
					<span className={styles.unreceived}>Rien reçu ?</span>
					<div>
						<button
							onClick={(e) => {
								if (timer !== 0) {
									e.preventDefault();
								} else {
									setTimer(30);
								}
							}}
							className={clsx(
								montserrat.className,
								(pending || (state.isSuccess && timer !== 0)) && "loading"
							)}
							disabled={pending}
							type="submit">
							{pending
								? "Envoi en cours"
								: state.isSuccess && timer !== 0
								? `${timer}`
								: "J'ai rien reçu"}
						</button>
						<button
							onClick={handleEnterCode}
							className={clsx(montserrat.className)}>
							Entrer le code
						</button>
					</div>
				</>
			)}
		</>
	);
}
