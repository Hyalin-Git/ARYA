import Image from "next/image";
import styles from "../styles/pages/home.module.css";
import { josefinSans } from "@/libs/fonts";
import Hero from "@/components/home/Hero";
import Service from "@/components/home/Services";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				{/* Hero  */}
				<div className={styles.hero}>
					<Hero />
				</div>
				{/* content */}
				<div>
					<section className={styles.services}>
						<h2>Une solution pour tous</h2>
						<Service />
					</section>

					{/* partie gratuite */}
				</div>
				{/* foot */}
				<div></div>
			</div>
		</main>
	);
}
