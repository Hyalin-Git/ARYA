"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/components/header/header.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Header() {
	const [isScroll, setIsScroll] = useState(false);
	const [isScrollEnd, setIsScrollEnd] = useState(false);

	useEffect(() => {
		document.addEventListener("scroll", (e) => {
			const documentHeight = document.body.scrollHeight;
			const currentScroll = window.scrollY + window.innerHeight;
			const marginOfError = 100;

			const header = document.getElementById("header");

			// When the user starts scrolling make the background appear
			if (header?.offsetTop > 10) {
				setIsScroll(true);
			}
			// If the user is at the top of the page then make the header background disapear
			if (header?.offsetTop <= 10) {
				setIsScroll(false);
			}

			// If the user is at the bottom of the page then make the header disapear
			if (currentScroll + marginOfError >= documentHeight) {
				setIsScrollEnd(true);
			} else {
				setIsScrollEnd(false);
			}
		});
	}, [isScroll]);

	return (
		<header className={styles.header} id="header">
			<nav
				className={clsx(
					styles.nav,
					isScroll && styles.slide,
					isScrollEnd && styles.disapear
				)}
				id="nav">
				{/* Logo  */}
				<div className={styles.logo}>
					<Link href="/">
						<Image
							src="/images/logo/Arya_Monochrome_White.png"
							width={60}
							height={60}
							alt="logo"
							loading="lazy"
						/>
						<h1>rya</h1>
					</Link>
				</div>
				{/* Menu  */}
				<div className={styles.menu}>
					<ul>
						<li>Link</li>
						<li>Link</li>

						<li>
							<Link href="/auth">Connexion </Link>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	);
}
