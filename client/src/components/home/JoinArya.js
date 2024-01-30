"use client";
import { montserrat } from "@/libs/fonts";
import styles from "../../styles/components/home/joinArya.module.css";
import { useEffect, useRef } from "react";

export default function JoinArya() {
	return (
		<section className={styles.container}>
			<div className={styles.titles}>
				<h2>
					Prêt à vivre une expérience unique <span>?</span>
				</h2>
				<h3>
					Explorez des opportunités incroyables en faisant partie de la vibrante
					communauté <span>Arya</span>.
				</h3>
			</div>
			<div className={styles.button__container}>
				<button className={montserrat.className}>
					Rejoindre la communauté
				</button>
			</div>
		</section>
	);
}
