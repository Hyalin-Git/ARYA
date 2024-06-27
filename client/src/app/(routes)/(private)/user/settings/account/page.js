"use client";
import styles from "@/styles/pages/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faKey,
	faEnvelope,
	faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useContext, useState } from "react";
import { montserrat } from "@/libs/fonts";
import { useFormState } from "react-dom";
import { AuthContext } from "@/context/auth";
import { deleteUserAccount } from "@/actions/user";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};
export default function Account() {
	const { uid } = useContext(AuthContext);
	const [displayModal, setDisplayModal] = useState(false);
	const [deleteAccount, setDeleteAccount] = useState(false);
	const deleteAccountWithUid = deleteUserAccount.bind(null, uid);
	const [state, formAction] = useFormState(deleteAccountWithUid, initialState);

	const passwordError = state?.error?.includes("password");

	console.log(state);
	return (
		<div className={styles.container}>
			<Link href={"/user/settings/account/mail"}>
				<div className={styles.wrapper}>
					<div>
						<FontAwesomeIcon icon={faEnvelope} />
					</div>
					<div>
						<span>Changer votre Adresse mail</span>
						<p>
							Changer votre adresse mail en confirmant votre nouvelle adresse.
						</p>
					</div>
				</div>
			</Link>
			<Link href={"/user/settings/account/password"}>
				<div className={styles.wrapper}>
					<div>
						<FontAwesomeIcon icon={faKey} />
					</div>
					<div>
						<span>Changer votre mot de passe</span>
						<p>Changer votre mot de passe à tout moment.</p>
					</div>
				</div>
			</Link>
			<div
				className={styles.wrapper}
				onClick={(e) => {
					e.preventDefault();
					setDisplayModal(true);
				}}>
				<div>
					<FontAwesomeIcon icon={faHeartBroken} />
				</div>
				<div>
					<span>Supprimer votre compte</span>
					<p>
						Suppression de votre compte Arya sans possibilité de récupération.
					</p>
				</div>
			</div>
			{displayModal && (
				<>
					<div className={styles.modal} id="modal">
						<span>Vous êtes sur le point de supprimer votre compte Arya</span>
						<p>
							Cette action est irréversible : vous n'aurez plus accès à votre
							compte et toutes les données liées à celui-ci seront également
							supprimées.
						</p>
						<span>
							Êtes-vous sûr de vouloir supprimer votre compte et toutes ses
							données ?
						</span>
						<div className={styles.buttons}>
							<button
								className={montserrat.className}
								onClick={(e) => {
									e.preventDefault();
									setDisplayModal(false);
								}}>
								Annuler
							</button>
							<button
								className={montserrat.className}
								onClick={(e) => {
									e.preventDefault();
									setDisplayModal(false);
									setDeleteAccount(true);
								}}>
								Confirmer
							</button>
						</div>
					</div>
					<div
						id="overlay"
						onClick={(e) => {
							e.preventDefault();
							setDisplayModal(false);
						}}></div>
				</>
			)}
			{deleteAccount && (
				<>
					<div className={styles.modal} id="modal">
						<div>
							<span>Suppression de votre compte Arya</span>
							<p>
								Veuillez saisir votre mot de passe afin de procéder à la
								suppression de votre compte
							</p>
						</div>
						<form action={formAction}>
							<label htmlFor="password">Mot de passe</label>
							<input
								data-error={passwordError}
								type="password"
								name="password"
								id="password"
							/>
							<br />
							{passwordError && (
								<i data-error={passwordError}>{state?.message}</i>
							)}
							<div className={styles.buttons}>
								<button
									className={montserrat.className}
									onClick={(e) => {
										e.preventDefault();
										setDeleteAccount(false);
									}}>
									Annuler
								</button>
								<button type="submit" className={montserrat.className}>
									Confirmer
								</button>
							</div>
						</form>
					</div>
					<div
						id="overlay"
						onClick={(e) => {
							e.preventDefault();
							setDeleteAccount(false);
						}}></div>
				</>
			)}
		</div>
	);
}
