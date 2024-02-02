import Image from "next/image";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/signIn.module.css";
import clsx from "clsx";

export default function SignIn() {
	function handleShowHidePassowrd(e) {
		const element = e.currentTarget;
		const image = element.children[0];
		const passwordInput = element.previousElementSibling;

		if (passwordInput.getAttribute("type") === "password") {
			image.src = "/images/icons/eye-slash_icon.svg";
			passwordInput.setAttribute("type", "text");
		} else {
			image.src = "/images/icons/eye_icon.svg";
			passwordInput.setAttribute("type", "password");
		}
	}
	return (
		<div className={styles.container}>
			<div className={styles.titles}>
				<h1>Connectez-vous</h1>
				<h2>Entrez vos coordonnées pour accéder à votre compte</h2>
			</div>
			<div className={styles.form}>
				<form action="">
					<label htmlFor="email">Adresse mail</label>
					<br />
					<input
						className={montserrat.className}
						type="email"
						name="email"
						id="email"
					/>
					<br />
					<br />
					<label htmlFor="password">Mot de passe</label>
					<br />
					<input
						className={montserrat.className}
						type="password"
						name="password"
						id="password"
					/>
					<div className={styles.visible} onClick={handleShowHidePassowrd}>
						<Image
							src="/images/icons/eye_icon.svg"
							width={20}
							height={20}
							alt="eye logo"
						/>
					</div>
					<br />
					<br />
					<button type="submit" className={montserrat.className}>
						Accédez à mon compte
					</button>
				</form>
			</div>
			<div className={styles.text}>
				<p>
					Vous n'avez pas de compte ? <span>Créer un compte</span>
				</p>
			</div>
		</div>
	);
}
