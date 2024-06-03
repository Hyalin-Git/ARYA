"use client";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/contactEditor.module.css";
import { useContext } from "react";

export default function ContactEditor() {
	const { user } = useContext(AuthContext);
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Contact</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="contact">Adresse mail de contact</label>
					<br />
					<input
						type="email"
						name="contact"
						id="contact"
						className={montserrat.className}
						defaultValue={user.contact}
					/>
				</div>
				<div></div>
			</div>
		</div>
	);
}
