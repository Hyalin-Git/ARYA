import { josefinSans } from "@/libs/fonts";
import styles from "../../styles/components/home/hero.module.css";

export default function Hero() {
	return (
		<div className={styles.hero__titles}>
			<div className={styles.hero__subtitle}>
				<h1>Créez, Optimisez, Partagez !</h1>
			</div>
			<div className={styles.hero__maintitle}>
				<h1>
					<span className={styles.hero__maintitle__span}>
						<span className={styles.hero__maintitle__arya}>Arya</span> le
						meilleur
					</span>
					<span className={styles.hero__maintitle__span}>ami du</span>{" "}
					<span className={styles.hero__maintitle__span}>
						freelance <button>Rejoindre la communauté</button>
					</span>
				</h1>
			</div>
			<div className={styles.hero__subtitle}>
				<h1>L’outil incontournable des créatifs.</h1>
			</div>
		</div>
	);
}
