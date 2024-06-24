"use client";
import styles from "@/styles/pages/password.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useFormState } from "react-dom";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect, useState } from "react";
import { sendEmailResetLink } from "@/actions/user";
import Link from "next/link";
import { montserrat } from "@/libs/fonts";
import PopUp from "@/components/popup/PopUp";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};

export default function Mail() {
	const { uid } = useContext(AuthContext);
	const [isDisabled, setIsDisabled] = useState(true);
	const [displayPopUp, setDisplayPopUp] = useState(false);
	const updateEmailWithUid = sendEmailResetLink.bind(null, uid);
	const [state, formAction] = useFormState(updateEmailWithUid, initialState);

	const passwordError = state?.error?.includes("password");
	const newEmailError = state?.error?.includes("newEmail");

	useEffect(() => {
		if (state?.status === "success" || state?.status === "failure") {
			setDisplayPopUp(true);
			const timeout = setTimeout(() => {
				setDisplayPopUp(false);
			}, 4000);
			if (displayPopUp) {
				clearTimeout(timeout);
			}
		}
		if (state?.status === "success") {
			document.getElementById("password").value = "";
			document.getElementById("newEmail").value = "";
		}
	}, [state]);

	function checkIfFilled(e) {
		e.preventDefault();
		const value = e.target.value;
		if (value.length > 0) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}

	console.log(state);
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.icon}>
					<Link href={"/user/settings/account"}>
						<FontAwesomeIcon icon={faArrowLeft} />
					</Link>
				</div>
				<span>Changer votre adresse mail</span>
			</div>
			<form action={formAction}>
				<div>
					<label htmlFor="password">Entrez votre mot de passe</label>
					<input
						data-error={passwordError}
						type="password"
						id="password"
						name="password"
						className={montserrat.className}
						placeholder="Mot de passe"
						onChange={checkIfFilled}
						required
					/>
					<br />
					{passwordError && <i data-error={passwordError}>{state?.message}</i>}
				</div>
				<br />
				<div>
					<label htmlFor="newEmail">Entrez la nouvelle adresse mail</label>
					<input
						data-error={newEmailError}
						type="email"
						id="newEmail"
						name="newEmail"
						className={montserrat.className}
						placeholder="Nouvelle adresse mail"
						onChange={checkIfFilled}
						required
					/>
					<br />
					{newEmailError && <i data-error={newEmailError}>{state?.message}</i>}
				</div>
				<br />
				<div className={styles.button}>
					<button
						type="submit"
						className={montserrat.className}
						data-disabled={isDisabled}
						disabled={isDisabled}>
						Confirmer
					</button>
				</div>
			</form>
			{displayPopUp && (
				<PopUp
					status={state.status}
					title="Demande de changement d'adresse mail"
					message={state.message}
				/>
			)}
		</div>
	);
}
