"use client";
import styles from "@/styles/components/auth/buttons.module.css";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { accountTypeValidation } from "@/libs/utils";

export default function Buttons({ step, setStep }) {
	// Previous step
	function handlePrevious(e) {
		e.preventDefault();
		const steps = e.target.parentElement.parentElement;
		const previousStep = steps.previousElementSibling;
		if (step > 1) setStep(step - 1);
		steps.style.display = "none";
		previousStep.style.display = "block";
	}

	// Next step
	async function handleForm(e) {
		e.preventDefault();
		const steps = e.target.parentElement.parentElement;
		// form validation
		const isValidate = accountTypeValidation();
		if (!isValidate) {
			return;
		}
		setStep(step + 1);
		const nextStep = steps.nextElementSibling;
		steps.style.display = "none";
		nextStep.style.display = "block";
	}

	return (
		<>
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
		</>
	);
}
