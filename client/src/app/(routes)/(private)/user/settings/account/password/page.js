"use client";
import styles from "@/styles/pages/password.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";
import { updateUserPassword } from "@/actions/user";
import { montserrat } from "@/libs/fonts";
import PopUp from "@/components/popup/PopUp";
const initialState = {
	status: "pending",
	message: "",
	error: [],
};

export default function Password() {
	const { uid } = useContext(AuthContext);
	const [isDisabled, setIsDisabled] = useState(true);
	const [displayPopUp, setDisplayPopUp] = useState(false);
	const updatePasswordWithUid = updateUserPassword.bind(null, uid);
	const [state, formAction] = useFormState(updatePasswordWithUid, initialState);

	// Differents inputs errors
	const passwordError = state?.error?.includes("password");
	const newPasswordError = state?.error?.includes("newPassword");
	const confirmNewPasswordError = state?.message?.includes("correspondent");

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

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.icon}>
					<Link href={"/user/settings/account"}>
						<FontAwesomeIcon icon={faArrowLeft} />
					</Link>
				</div>
				<span>Changer votre mot de passe</span>
			</div>
			<form action={formAction}>
				<div>
					<label htmlFor="password">Mot de passe actuel</label>
					<input
						data-error={passwordError}
						type="password"
						id="password"
						name="password"
						className={montserrat.className}
						onChange={checkIfFilled}
						placeholder="Mot de passe actuel"
					/>
					<br />
					{passwordError && <i data-error={passwordError}>{state?.message}</i>}
				</div>
				<br />
				<div>
					<label htmlFor="newPassword">Nouveau mot de passe</label>
					<input
						data-error={newPasswordError}
						type="password"
						id="newPassword"
						name="newPassword"
						className={montserrat.className}
						onChange={checkIfFilled}
						placeholder="Nouveau mot de passe"
					/>
					<br />
					{newPasswordError && (
						<i data-error={newPasswordError}>{state?.message}</i>
					)}
				</div>
				<br />
				<div>
					<label htmlFor="confirmPassword">Confirmer le mot de passe</label>
					<input
						data-error={confirmNewPasswordError}
						type="password"
						id="confirmNewPassword"
						name="confirmNewPassword"
						className={montserrat.className}
						onChange={checkIfFilled}
						placeholder="Vérification du mot de passe"
					/>
					<br />
					{confirmNewPasswordError && (
						<i data-error={confirmNewPasswordError}>{state?.message}</i>
					)}
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
					title="Mot de passe"
					message={state.message}
				/>
			)}
		</div>
	);
}
