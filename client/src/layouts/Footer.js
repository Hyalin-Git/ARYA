"use client";
import styles from "@/styles/layouts/footer.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Footer() {
	return (
		<footer>
			<div className={styles.container}>
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
				<div className={styles.links}>
					<ul>
						<li>links</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}
