import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { useMemo, useState } from "react";
import styles from "@/styles/components/auth/forgotPassword.module.css";

export default function Submit({ state, isCodeSent, setStep }) {
	const [timer, setTimer] = useState(60);
	const { pending } = useFormStatus();

	function handleEnterCode(e) {
		e.preventDefault();
		document.getElementById("step-1").style.display = "none";
		document.getElementById("step-2").style.display = "block";
		setStep(2);
	}

	useMemo(() => {
		let interval;
		if (state?.isSuccess) {
			interval = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		}
		if (timer === 0) {
			clearInterval(interval);
		}
	}, [state, timer]);

	return (
		<>
			{!pending && (
				<>
					{state?.isSuccess && (
						<div className={styles.success}>
							<i>{state?.message}</i>
							<br />
							<br />
						</div>
					)}
					{state?.isFailure && (
						<div className={styles.failure}>
							<i>{state?.message}</i>
							<br />
							<br />
						</div>
					)}
				</>
			)}
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
									setTimer(60);
								}
							}}
							className={clsx(
								montserrat.className,
								(pending || timer !== 0) && "loading"
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
