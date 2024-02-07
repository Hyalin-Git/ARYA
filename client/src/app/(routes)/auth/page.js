"use client";
import { useState } from "react";
import styles from "@/styles/pages/auth.module.css";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Auth() {
	const [isSignIn, setIsSignIn] = useState(true);
	const [isSignUp, setIsSignUp] = useState(false);
	const [step, setStep] = useState(1);

	return (
		<main>
			<div className={styles.container}>
				<div className={styles.leftside}></div>
				<div className={styles.rightside}>
					{isSignIn && (
						<SignIn setIsSignIn={setIsSignIn} setIsSignUp={setIsSignUp} />
					)}
					{isSignUp && (
						<SignUp
							setIsSignUp={setIsSignUp}
							setIsSignIn={setIsSignIn}
							step={step}
							setStep={setStep}
						/>
					)}
				</div>
			</div>
		</main>
	);
}
