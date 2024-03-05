import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import styles from "@/styles/components/auth/forgotPassword.module.css";

export default function Submit({ state, isCodeSent, setStep }) {
	const [timer, setTimer] = useState(30);
	const { pending } = useFormStatus();

	function handleEnterCode(e) {
		e.preventDefault();
		document.getElementById("step-1").style.display = "none";
		document.getElementById("step-2").style.display = "block";
		setStep(2);
	}

	useEffect(() => {
		let interval;
		if (state?.isSuccess) {
			interval = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		}
		if (state?.isFailure) {
			setTimer(0);
			return;
		}
		if (timer === 0) {
			clearInterval(interval);
		}
	}, [state, timer]);

	return (
		<>
			{!isCodeSent ? (
				<button
					id="send-btn"
					className={clsx(montserrat.className, pending && "loading")}
					disabled={pending}
					type="submit">
					{pending ? "Envoi en cours" : "Envoyer le code"}
				</button>
			) : (
				<>
					<span className={styles.unreceived}>Rien reçu ?</span>
					<div>
						<button
							onClick={(e) => {
								if (timer !== 0) {
									e.preventDefault();
								} else {
									setTimer(30);
								}
							}}
							className={clsx(
								montserrat.className,
								(pending || (state.isSuccess && timer !== 0)) && "loading"
							)}
							disabled={pending}
							type="submit">
							{pending
								? "Envoi en cours"
								: state.isSuccess && timer !== 0
								? `${timer}`
								: "J'ai rien reçu"}
						</button>
						<button
							onClick={handleEnterCode}
							className={clsx(montserrat.className)}>
							Entrer le code
						</button>
					</div>
				</>
			)}
		</>
	);
}
