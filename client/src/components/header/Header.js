"use client";
import Image from "next/image";
import styles from "../../styles/components/header/header.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Header() {
	const [isScroll, setIsScroll] = useState(false);

	useEffect(() => {
		document.addEventListener("scroll", (e) => {
			const header = document.getElementById("header");

			if (header.offsetTop > 10) {
				setIsScroll(true);
			}

			if (header.offsetTop <= 10) {
				setIsScroll(false);
			}
		});
	}, [isScroll]);

	return (
		<header className={styles.header} id="header">
			<nav className={clsx(styles.nav, isScroll ? styles.slide : "")} id="nav">
				{/* Logo  */}
				<div className={styles.logo}>
					<Image
						src="/images/logo/Arya_Monochrome_White.png"
						width={65}
						height={65}
						alt="logo"
						loading="lazy"
					/>
					<h1>rya</h1>
				</div>
				{/* Menu  */}
				<div className={styles.menu}>
					<ul>
						<li>Link</li>
						<li>Link</li>
						<li>Link</li>
					</ul>
				</div>
			</nav>
		</header>
	);
}
