"use client";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signUpSuccess.module.css";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
export default function SignUpSuccess({ state }) {
	const [timer, setTimer] = useState(30);

	useMemo(() => {
		let interval;

		interval = setTimeout(() => {
			setTimer(timer - 1);
		}, 1000);

		if (timer === 0) {
			clearInterval(interval);
		}
	}, [state, timer]);
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
				<div className={styles.button}>
					<button
						onClick={(e) => {
							if (timer !== 0) {
								e.preventDefault();
							} else {
								setTimer(30);
							}
						}}
						className={clsx(montserrat.className)}>
						Renvoyer un mail de vérification
					</button>
				</div>
			</div>
			<div className={styles.help}>
				<p>
					Besoin d'aide ? <Link href={"/contact"}>Contactez-nous</Link>
				</p>
			</div>
		</div>
	);
}
