import Image from "next/image";
import styles from "../styles/pages/home.module.css";
import { josefinSans } from "@/libs/fonts";
import Hero from "@/components/home/Hero";
import Service from "@/components/home/Services";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				{/* heading  */}
				<div className={styles.hero}>
					<Hero />
				</div>
				{/* content */}
				<div className={styles.main}>
					<Service />
					{/* partie gratuite */}
					<section className={styles.main__section}>
						<h2></h2>
						{/* find job */}
						<article>
							<div></div>
							<div></div>
						</article>
						{/* social */}
						<article>
							<div></div>
							<div></div>
						</article>
						{/* agenda */}
						<article>
							<div></div>
							<div></div>
						</article>
					</section>
					{/* partie payante */}
					<section className={styles.main__section}>
						<article></article>
						<article></article>
					</section>
				</div>
				{/* foot */}
				<div></div>
			</div>
		</main>
	);
}
