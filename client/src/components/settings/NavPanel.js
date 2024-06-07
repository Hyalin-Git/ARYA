import styles from "@/styles/components/settings/navPanel.module.css";

export default function NavPanel() {
	return (
		<div className={styles.container}>
			<ul>
				<li>Informations du profil</li>
				<li>Informations du compte</li>
				{/* <li>Préférences du compte</li> */}
				<li>Vie privée et sécurité</li>
				<li>Notifications</li>
			</ul>
		</div>
	);
}
