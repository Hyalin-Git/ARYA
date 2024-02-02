"use client";
import Image from "next/image";
import styles from "@/styles/pages/auth.module.css";
import { useState } from "react";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Auth() {
	const [isSignIn, setIsSignIn] = useState(true);
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<main>
			<div className={styles.container}>
				{/* image  */}
				<div className={styles.left}></div>
				{/* form */}
				<div className={styles.right}>
					{isSignIn && (
						<SignIn setIsSignIn={setIsSignIn} setIsSignUp={setIsSignUp} />
					)}
					{isSignUp && (
						<SignUp setIsSignUp={setIsSignUp} setIsSignIn={setIsSignIn} />
					)}
				</div>
			</div>
		</main>
	);
}
