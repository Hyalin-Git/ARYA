import styles from "@/styles/layouts/sideNav.module.css";
import Image from "next/image";
export default function SideNav() {
	return (
		<aside className={styles.container}>
			<nav className={styles.nav}>
				<div className={styles.div}>
					<ul className={styles.list}>
						<li>
							<Image
								src="/images/icons/search_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>{" "}
							<span>Mon compte</span>{" "}
						</li>
						<li>
							<Image
								src="/images/icons/search_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>{" "}
							<span>Recherche</span>
						</li>
						<li>
							<Image
								src="/images/icons/bell_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>{" "}
							<span>Notifications</span>
						</li>
						<li>
							<Image
								src="/images/icons/setting_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>{" "}
							<span>Paramètres</span>
						</li>
						<li>
							<Image
								src="/images/icons/help_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>{" "}
							<span>Aide</span>
						</li>
					</ul>
				</div>
			</nav>
		</aside>
	);
}
