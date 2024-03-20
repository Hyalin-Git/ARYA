"use client";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import styles from "@/styles/pages/aryaMedia.module.css";
import Header from "@/layouts/Header";

export default function AryaMediaLayout({ children }) {
	const { isLoading } = useContext(AuthContext);
	if (isLoading) {
		return <h1>Loading...</h1>;
	}
	return (
		<>
			<Header />
			<div className={styles.container}>{children}</div>
		</>
	);
}
