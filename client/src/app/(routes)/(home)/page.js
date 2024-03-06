"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/pages/home.module.css";
import { josefinSans, montserrat } from "@/libs/fonts";
import Hero from "@/components/home/Hero";
import Service from "@/components/home/Services";
import Features from "@/components/home/Features";
import JoinArya from "@/components/home/JoinArya";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				{/* Hero  */}
				<div className={styles.hero}>
					<Hero />
					<div className={styles.arrow}>
						<Link href="#content">
							<Image
								src="images/icons/arrow_icon.svg"
								width={20}
								height={20}
								alt="arrow"
							/>
						</Link>
					</div>
				</div>
				{/* content */}
				<div className={styles.content} id="content">
					<Service />
					<div className={styles.line}></div>
					<Features />
					<div className={styles.line}></div>
				</div>
				{/* foot */}
				<div className={styles.bottom}>
					<JoinArya />
				</div>
			</div>
		</main>
	);
}
