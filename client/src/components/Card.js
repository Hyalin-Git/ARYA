"use client";
import Link from "next/link";
import Image from "next/image";
import Markdown from "markdown-to-jsx";
import styles from "../styles/components/card.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Card({ elements }) {
	const [isClient, setIsClient] = useState(false);
	const options = {
		root: null, // L'élément racine utilisé comme viewport. Si null, le viewport du navigateur est utilisé.
		rootMargin: "0px", // Marge autour du viewport pour étendre ou réduire la zone d'intersection.
		threshold: 0.8, // Valeur de seuil pour déterminer quand l'élément est considéré comme intersecté (0.5 signifie que la moitié de l'élément doit être visible).
	};
	useEffect(() => {
		const cards = document.getElementsByClassName("card");

		window.addEventListener("touchstart", function (e) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (window.innerWidth <= "780") {
						entry.target.classList.toggle(styles.inView, entry.isIntersecting);
						entry.target.classList.toggle(styles.hover, entry.isIntersecting);
					} else {
						entry.target.classList.remove(styles.inView);
					}
				});
			}, options);

			for (const card of cards) {
				observer.observe(card);
			}
		});
		setIsClient(true);
	}, []);
	return (
		<Link href={"#" + elements.anchor} className={styles.link}>
			<article
				data-sub={elements.subscriptions}
				className={clsx(styles.container, styles.hover, "card")}>
				<div className={styles.images}>
					<div className={styles.logo}>
						<Image src={elements.icon} width={60} height={60} alt="logo" />
					</div>
					{elements.subscriptions && (
						<div className={styles.crown}>
							<Image
								src="/images/icons/crown_icon.svg"
								width={35}
								height={35}
								alt="crown"
							/>
						</div>
					)}
				</div>
				<div className={styles.body}>
					<div className={styles.title}>
						<h3>{elements.title}</h3>
					</div>
					<div className={styles.content}>
						{isClient && <Markdown>{elements.description}</Markdown>}
					</div>
				</div>
			</article>
		</Link>
	);
}
