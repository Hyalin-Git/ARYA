import Image from "next/image";
import styles from "../../styles/components/header/header.module.css";

export default function Header() {
	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
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
