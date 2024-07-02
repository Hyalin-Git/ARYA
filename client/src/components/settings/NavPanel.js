"use client";
import styles from "@/styles/components/settings/navPanel.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavPanel() {
	const pathname = usePathname();
	const isSettings =
		pathname.includes("/settings") &&
		!pathname.includes("/account") &&
		!pathname.includes("/privacy-security");
	const isAccount = pathname.includes("/account");
	const isPrivacySecurity = pathname.includes("/privacy-security");
	console.log(isAccount);
	console.log(pathname);
	const [openId, setOpenId] = useState(null);

	function handleOpen(id) {
		setOpenId(openId === id ? null : id);
	}
	return (
		<div className={styles.container}>
			<ul>
				<Link href={"/user/settings"}>
					<li data-active={isSettings}>Informations du profil</li>
				</Link>
				<Link href={"/user/settings/account"}>
					<li data-active={isAccount}>Informations du compte</li>
				</Link>
				<Link href={"/user/settings/privacy-security"}>
					<li data-active={isPrivacySecurity}>Vie privée et sécurité</li>
				</Link>
				<Link href={"/user/settings"}>
					<li>Notifications</li>
				</Link>
			</ul>
		</div>
	);
}
