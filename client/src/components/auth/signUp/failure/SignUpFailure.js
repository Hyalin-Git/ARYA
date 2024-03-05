"use client";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signUpSuccess.module.css";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SignUpFailure({ state, setStep }) {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<div className={styles.titles}>
				<h2>Un problème est survenu</h2>
				<h3>Quelque chose s'est mal passé de notre côté</h3>
			</div>
			<div>
				<p>
					Il semblerait qu'un erreur se soit produite lors de la création de
					votre compte.
					<br />
					<br />
					Veuillez réessayer ultérieurement
					<br />
					<br />
					Si le problème persiste, n'hésitez pas à nous contacter.
				</p>
			</div>

			<div className={styles.button}>
				<button
					onClick={() => {
						state.isFailure = false;
						state.status = "pending";
						setStep(1);
						router.refresh();
					}}
					className={clsx(montserrat.className)}>
					Réessayer
				</button>
			</div>

			<div className={styles.help}>
				<p>
					Besoin d'aide ? <Link href={"/contact"}>Contactez-nous</Link>
				</p>
			</div>
		</div>
	);
}
