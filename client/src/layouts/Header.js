"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/context/auth";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/layouts/header.module.css";
import clsx from "clsx";
import { montserrat } from "@/libs/fonts";
import HeaderUserInfo from "@/components/header/HeaderUserInfo";
import DarkModeBtn from "@/components/DarkModeBtn";

export default function Header() {
	const context = useContext(AuthContext);
	const [isScroll, setIsScroll] = useState(false);
	const [isScrollEnd, setIsScrollEnd] = useState(false);
	const pathname = usePathname();

	const showHeaderRoutes = ["/", "/social", "/Arya"];

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
		if (pathname.includes("/social")) {
			document.getElementById("nav").style.color = "white";
			document.getElementById("nav");

			document.getElementById("nav").style.backgroundColor = "#712fd9";
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
									src={
										isScroll || pathname.includes("/social")
											? "/images/logo/Arya_Monochrome_White.png"
											: "/images/logo/Arya_Monochrome_black.png"
									}
									width={60}
									height={60}
									alt="logo"
									loading="lazy"
									id="logo"
								/>
								<h1>rya</h1>
							</Link>
						</div>
						{context?.uid && (
							<div className={styles.searchbar}>
								<input
									className={montserrat.className}
									type="search"
									placeholder="Recherche"
								/>
							</div>
						)}
						{/* Menu  */}
						<div className={styles.menu}>
							{!context?.uid ? (
								<ul>
									<li>
										<Link href="/auth">Connexion </Link>
									</li>
									<DarkModeBtn />
								</ul>
							) : (
								<ul className={styles.connected}>
									<li>
										<Image
											src="./images/icons/briefcase_icon.svg"
											width={25}
											height={25}
											alt="icon"
										/>
									</li>
									<li>
										<Image
											src="./images/icons/bell_icon.svg"
											width={25}
											height={25}
											alt="icon"
										/>
									</li>
									<li></li>
									<HeaderUserInfo user={context?.user} />
									<DarkModeBtn />
									<li>
										<Image
											src="./images/icons/nine_dots_icon.svg"
											width={30}
											height={30}
											alt="icon"
										/>
									</li>
								</ul>
							)}
						</div>
					</nav>
				</header>
			)}
		</>
	);
}
