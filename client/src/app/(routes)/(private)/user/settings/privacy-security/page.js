"use server";
import styles from "@/styles/pages/privacySecurity.module.css";
import { faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function PrivacySecurity() {
	return (
		<div className={styles.container}>
			<Link href={"/user/settings/privacy-security/block"}>
				<div className={styles.wrapper}>
					<div>
						<FontAwesomeIcon icon={faUsersSlash} />
					</div>
					<div>
						<span>Gérez les utilisateurs bloqués</span>
						<p>Gérer les compte que vous avez bloqué.</p>
					</div>
				</div>
			</Link>
		</div>
	);
}
