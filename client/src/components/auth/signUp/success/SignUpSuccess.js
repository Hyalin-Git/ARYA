"use client";
import { reSendVerifyEmail } from "@/actions/verifications";
import styles from "@/styles/components/auth/signUpSuccess.module.css";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import SignUpSuccessSubmit from "./SignUpSuccessSubmit";
import PopUp from "@/components/popup/PopUp";
import { useFormState } from "react-dom";

export default function SignUpSuccess({ state }) {
	const initialState = {
		isFailure: false,
		isSuccess: false,
		message: "",
	};
	const [newState, formAction] = useFormState(reSendVerifyEmail, initialState);

	const [showPopUp, setShowPopUp] = useState(false);

	useEffect(() => {
		if (newState?.isSuccess || newState?.isFailure) {
			setShowPopUp(true);
			const interval = setTimeout(() => {
				setShowPopUp(false);
			}, 4000);
			if (showPopUp) {
				clearTimeout(interval);
			}
		}
	}, [newState]);

	return (
		<div className={styles.container}>
			<div>
				<h2>Félicitations et bienvenue</h2>
				<h3>Un mail de confirmation vous a été envoyé</h3>
			</div>
			<div>
				<p>
					Veuillez confirmer votre adresse mail en cliquant sur le lien de
					confirmation envoyé à : <br /> <br />
					<strong>{state.message}</strong>
				</p>
			</div>
			<div className={styles.bottom}>
				<div>
					<h4>Vous n'avez rien reçu ?</h4>
					<p>Vérifiez que l'adresse mail enregistrée est correcte.</p>
				</div>
				<div className={styles.or}>
					<div className={styles.line}></div>
					<div>
						<span>ou</span>
					</div>
					<div className={styles.line}></div>
				</div>
				<div className={styles.form}>
					<form action={formAction}>
						<input
							type="hidden"
							name="email"
							id="email"
							defaultValue={state?.message}
						/>
						<SignUpSuccessSubmit newState={newState} />
					</form>
				</div>
			</div>
			<div className={styles.help}>
				<p>
					Besoin d'aide ? <Link href={"/contact"}>Contactez-nous</Link>
				</p>
			</div>
			{showPopUp && (
				<PopUp
					status={newState?.isSuccess ? "success" : "failure"}
					title={
						newState?.isSuccess
							? "Un nouveau mail de confirmation a été envoyé"
							: "Une erreur est survenu"
					}
					message={newState?.message}
				/>
			)}
		</div>
	);
}
