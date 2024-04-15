import { verifyResetPasswordCode } from "@/actions/verifications";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/forgotPassword.module.css";
import clsx from "clsx";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import PopUp from "@/components/popup/PopUp";

export default function VerifyCodeStep({ setStep }) {
	const initialState = {
		isFailure: false,
		isSuccess: false,
		message: "",
	};
	const [showPopUp, setShowPopUp] = useState(false);
	const [state, formAction] = useFormState(
		verifyResetPasswordCode,
		initialState
	);

	useMemo(() => {
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
			<div className={styles.titles}>
				<h1>Validez votre code de réinitialisation</h1>
				<h2>Entrez votre code de réinitialisation</h2>
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<div className={styles.labels}>
						<div>
							<label htmlFor="code">Code de réinitialisation</label>
						</div>
						<div>
							<i className={styles.errorMsg}></i>
						</div>
					</div>
					<input
						className={clsx(montserrat.className, styles.email)}
						type="text"
						name="code"
						id="code"
						placeholder="Code de réinitialisation"
					/>
					<br />
					<br />
					<VerifyCodeSubmit state={state} setStep={setStep} />
				</form>
			</div>
			{/* Will display on failure only  */}
			{showPopUp && (
				<PopUp
					status={"failure"}
					title={"Une erreur est survenu"}
					message={state?.message}
				/>
			)}
		</>
	);
}

export function VerifyCodeSubmit({ state, setStep }) {
	const { pending } = useFormStatus();

	useEffect(() => {
		if (state?.isSuccess) {
			document.getElementById("step-2").style.display = "none";
			document.getElementById("step-3").style.display = "block";
			setStep(3);
		}
	}, [state]);

	return (
		<button className={clsx(montserrat.className, pending && "loading")}>
			{pending ? "Vérification en cours" : "Vérifier le code"}
		</button>
	);
}
