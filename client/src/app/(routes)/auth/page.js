"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/pages/auth.module.css";
import SignIn from "@/components/auth/signIn/SignIn";
import SignUp from "@/components/auth/SignUp";
import StepTracker from "@/components/auth/StepTracker";

export default function Auth() {
	const [isSignIn, setIsSignIn] = useState(true);
	const [isSignUp, setIsSignUp] = useState(false);
	const [step, setStep] = useState(1);

	return (
		<main>
			<div className={styles.container}>
				<div className={styles.leftside}>
					<div className={styles.content}>
						<div className={styles.logo}>
							<Image
								src="/images/logo/Arya_Monochrome_White_upscaled.png"
								width={620}
								height={620}
								alt="Arya logo"
							/>
						</div>
					</div>
					{isSignUp && <StepTracker step={step} />}
				</div>
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
