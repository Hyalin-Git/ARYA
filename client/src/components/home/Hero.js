import { josefinSans } from "@/libs/fonts";
import styles from "../../styles/components/home/hero.module.css";

export default function Hero() {
	return (
		<>
			<div className={styles.hero__title}>
				<div className={styles.hero__subtitle}>
					<h1>Créez, Optimisez, Partagez !</h1>
				</div>
				<div className={styles.hero__maintitle}>
					<h1>
						<span className={styles.hero__maintitle__span}>Arya</span> le
						meilleur{" "}
						<span className={styles.hero__maintitle__span}>
							<a href="">Rejoindre la communauté</a> ami du
						</span>{" "}
						<span className={styles.hero__maintitle__span}>freelance</span>
					</h1>
					{/* <button className={josefinSans.className}>
						Rejoindre la communauté
					</button> */}
				</div>
				<div className={styles.hero__subtitle}>
					<h1>L’outil incontournable des créatifs.</h1>
				</div>
			</div>
		</>
	);
}
