"use client";
import styles from "@/styles/components/settings/navPanel.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavPanel() {
	const [openId, setOpenId] = useState(null);
	const nav = [
		{
			id: 0,
			title: "Informations du profil",
			inside: [
				{
					anchor: "user",
					title: "Informations de l'utilisateur",
				},

				{
					anchor: "social",
					title: "Réseau social",
				},
				{
					anchor: "tools",
					title: "Outils",
				},
				{
					anchor: "type",
					title: "Type de compte",
				},
			],
		},
		{
			id: 1,
			title: "Informations du compte",
		},
		{
			id: 2,
			title: "Vie privée et sécurité",
			inside: [
				{
					anchor: "user",
					title: "Informations de l'utilisateur",
				},
				{
					anchor: "social",
					title: "Réseau social",
				},
				{
					anchor: "type",
					title: "Type de compte",
				},
			],
		},
		{
			id: 3,
			title: "Notifications",
		},
	];
	function handleOpen(id) {
		setOpenId(openId === id ? null : id);
	}
	return (
		<div className={styles.container}>
			<ul>
				{nav.map((link) => {
					return (
						<li onClick={() => handleOpen(link.id)}>
							<span>
								{link.title}
								{link.inside && (
									<Image
										src="/images/icons/angleDown_icon.svg"
										alt="icon"
										width={20}
										height={20}
									/>
								)}
							</span>
							{link.inside && openId === link.id && (
								<ul>
									{link.inside.map((inse) => {
										return (
											<Link href={`#${inse.anchor}`}>
												<li>{inse.title}</li>{" "}
											</Link>
										);
									})}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
