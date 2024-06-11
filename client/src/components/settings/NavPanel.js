import styles from "@/styles/components/settings/navPanel.module.css";
import Image from "next/image";

export default function NavPanel() {
	const nav = [
		{
			id: 0,
			title: "Informations du profil",
			inside: [
				"Informations de l'utilisateur",
				"Réseau social",
				"Type de compte",
			],
		},
		{
			id: 1,
			title: "Informations du compte",
		},
		{
			id: 2,
			title: "Vie privée et sécurité",
		},
		{
			id: 3,
			title: "Notifications",
		},
	];
	return (
		<div className={styles.container}>
			<ul>
				{nav.map((link) => {
					return (
						<li>
							{link.title}
							{link.inside && (
								<>
									<Image
										src="/images/icons/angleDown_icon.svg"
										alt="icon"
										width={20}
										height={20}
									/>
									<ul>
										{link.inside.map((insid) => {
											return <li>{insid}</li>;
										})}
									</ul>
								</>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
