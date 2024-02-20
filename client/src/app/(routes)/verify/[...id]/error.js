"use client"; // Error components must be Client Components
import styles from "@/styles/layouts/error.module.css";
import { useContext, useEffect } from "react";
import NotFound from "./not-found";
import { montserrat } from "@/libs/fonts";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/context/auth";

export default function Error({ error, reset }) {
	const uid = useContext(AuthContext);
	console.log(uid);
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	const isUserNotFound = error.message.includes("Aucun utilisateur trouvé");
	const isInvalidLink = error.message.includes("Lien invalide");
	const alreadyVerified = error.message.includes("Utilisateur déjà vérifié");
	const isUnspecifiedError =
		!isUserNotFound && !isInvalidLink && !alreadyVerified;
	return (
		<div className={styles.container}>
			<div className={styles.background}>
				<div>
					<h2>Erreur de vérification d'adresse e-mail</h2>
					<br />
					<Image
						src="/images/icons/failure_icon.svg"
						width={80}
						height={80}
						alt="icone d'erreur"
					/>
				</div>

				{isUserNotFound && (
					<>
						<div>
							<p>L'utilisateur associé n'a pas été trouvé</p>
							<p>
								Veuillez vérifier que vous avez utilisé le bon lien de
								vérification.
							</p>
						</div>
					</>
				)}
				{isInvalidLink && (
					<>
						<div>
							<p>Le lien de vérification que vous avez utilisé est invalide</p>
							<p>
								Veuillez vérifier que vous avez utilisé le bon lien de
								vérification.
							</p>
						</div>
					</>
				)}
				{alreadyVerified && (
					<>
						<div>
							<p>Le lien de vérification a déjà été vérifié</p>
							<p>
								Veuillez vérifier que vous avez utilisé le bon lien de
								vérification.
							</p>
						</div>
					</>
				)}

				{isUnspecifiedError && (
					<>
						<div>
							<p>
								On dirait bien qu'un problème est survenu lors de la
								vérification
							</p>
							<p>
								Veuillez vérifier que vous avez utilisé le bon lien de
								vérification.
							</p>
						</div>
					</>
				)}

				<div className={styles.buttons}>
					<Link href={uid ? "/portal" : "/"}>
						<button className={montserrat.className}>Revenir en arrière</button>
					</Link>

					<button
						className={montserrat.className}
						onClick={
							// Attempt to recover by trying to re-render the segment
							() => reset()
						}>
						Réessayer
					</button>
				</div>
				<div>
					<div>
						<p>
							Besoin d'aide ? <Link href="/">contactez-nous</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
