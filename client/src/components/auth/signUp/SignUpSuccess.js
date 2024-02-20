import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signUpSuccess.module.css";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
export default function SignUpSuccess({ state }) {
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
					<button className={clsx(montserrat.className)}>
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
