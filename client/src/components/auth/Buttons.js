"use client";
import styles from "@/styles/components/auth/buttons.module.css";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";

export default function Buttons({ setStep }) {
	// Previous step
	function handlePrevious(e) {
		e.preventDefault();
		const step = e.target.parentElement.parentElement;
		console.log(step);
		const previousStep = step.previousElementSibling;
		setStep(1);
		step.style.display = "none";
		previousStep.style.display = "block";
	}

	// Next step
	function handleForm(e) {
		e.preventDefault();
		const step = e.target.parentElement.parentElement;
		console.log(step);
		const nextStep = step.nextElementSibling;
		setStep(3);
		step.style.display = "none";
		nextStep.style.display = "block";
	}

	return (
		<div className={styles.buttons}>
			<button type="submit" className={clsx(montserrat.className, styles.skip)}>
				Passer les étapes
			</button>
			<button
				onClick={handlePrevious}
				className={clsx(montserrat.className, styles.previous)}>
				Retour
			</button>

			<button
				onClick={handleForm}
				className={clsx(montserrat.className, styles.next)}>
				Suivant
			</button>
		</div>
	);
}
