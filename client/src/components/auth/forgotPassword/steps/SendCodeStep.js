import { sendResetCode } from "@/actions/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/forgotPassword.module.css";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import Submit from "../Submit";
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
					<Submit state={state} isCodeSent={isCodeSent} setStep={setStep} />
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
