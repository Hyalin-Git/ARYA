"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/context/auth";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/layouts/header.module.css";
import clsx from "clsx";
import { montserrat } from "@/libs/fonts";
import UsInfo from "../components/UsInfo";
import { HeaderUser } from "@/libs/skeletons";

export default function Header() {
	const context = useContext(AuthContext);
	const [isScroll, setIsScroll] = useState(false);
	const [isScrollEnd, setIsScrollEnd] = useState(false);
	const pathname = usePathname();

	const showHeaderRoutes = ["/", "/AryaMedia", "/Arya"];

	useEffect(() => {
		const header = document.getElementById("header");
		document.addEventListener("scroll", (e) => {
			const documentHeight = document.body.scrollHeight;
			const currentScroll = window.scrollY + window.innerHeight;
			const marginOfError = 100;

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
		if (pathname.includes("/AryaMedia")) {
			document.getElementById("nav").style.justifyContent = "space-between";
		}
	}, [pathname, isScroll]);

	return (
		<>
			{showHeaderRoutes.includes(pathname) && (
				<header className={styles.header} id="header">
					<nav
						className={clsx(
							styles.nav,
							isScroll && styles.slide,
							isScrollEnd && styles.disapear,
							context?.uid && styles.connected
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
								{!context?.uid && <h1>rya</h1>}
							</Link>
							{context?.uid && (
								<div>
									<input
										type="search"
										placeholder="Recherche"
										className={montserrat.className}
									/>
								</div>
							)}
						</div>

						{/* Menu  */}
						<div className={styles.menu}>
							{!context?.uid ? (
								<ul>
									<li>
										<Link href="/auth">Connexion </Link>
									</li>
								</ul>
							) : (
								<ul className={styles.connected}>
									<li>
										<Image
											src="./images/icons/bell_icon.svg"
											width={25}
											height={25}
											alt="icon"
										/>
									</li>
									<li></li>
									<Suspense fallback={<HeaderUser />}>
										<UsInfo />
									</Suspense>
								</ul>
							)}
						</div>
					</nav>
				</header>
			)}
		</>
	);
}
