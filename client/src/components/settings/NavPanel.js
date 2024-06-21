"use client";
import styles from "@/styles/components/settings/navPanel.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavPanel() {
	const pathname = usePathname();
	const isSettings =
		pathname.includes("/settings") && !pathname.includes("/account");
	const isAccount = pathname.includes("/account");
	console.log(isAccount);
	console.log(pathname);
	const [openId, setOpenId] = useState(null);

	function handleOpen(id) {
		setOpenId(openId === id ? null : id);
	}
	return (
		<div className={styles.container}>
			<ul>
				<li data-active={isSettings}>
					<Link href={"/user/settings"}>Informations du profil </Link>
				</li>
				<li data-active={isAccount}>
					<Link href={"/user/settings/account"}>Informations du compte</Link>
				</li>
				<li>
					<Link href={"/user/settings"}>Vie privée et sécurité</Link>
				</li>
				<li>
					<Link href={"/user/settings"}>Notifications</Link>
				</li>
			</ul>
		</div>
	);
}
