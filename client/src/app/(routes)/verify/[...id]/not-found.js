import Link from "next/link";
import styles from "@/styles/layouts/notFound.module.css";

export default function NotFound() {
	return (
		<div className={styles.container}>
			<div>
				<h2>Erreur de vérification d'adresse e-mail</h2>
			</div>
			<div>
				<p>
					Le lien de vérification que vous avez utilisé est invalide ou
					l'utilisateur associé n'a pas été trouvé
				</p>
				<p>
					Veuillez vérifier que vous avez utilisé le bon lien de vérification.
				</p>
			</div>
			<div>
				<p>
					Besoin d'aide ? <span>contactez-nous</span>
				</p>
			</div>
			<div>
				<Link href="/">Return Home</Link>
			</div>
		</div>
	);
}
