import { montserrat } from "@/libs/fonts";
import styles from "../../styles/components/home/hero.module.css";

export default function Hero() {
	return (
		<div className={styles.titles}>
			<div className={styles.subtitle}>
				<h1>Créez, Optimisez, Partagez !</h1>
			</div>
			<div className={styles.maintitle}>
				<h1>
					<span className={styles.maintitle__arya}>Arya</span> le meilleur
					<br />
					ami du freelance
					<br />
					<button className={montserrat.className}>
						Rejoindre la communauté
					</button>
				</h1>
			</div>
			<div className={styles.subtitle}>
				<h1>L’outil incontournable des créatifs.</h1>
			</div>
		</div>
	);
}
