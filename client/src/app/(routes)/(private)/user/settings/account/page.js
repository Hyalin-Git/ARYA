import styles from "@/styles/pages/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faKey,
	faEnvelope,
	faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function Account() {
	return (
		<div className={styles.container}>
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
			<div className={styles.wrapper}>
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
		</div>
	);
}
