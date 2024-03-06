"use client";
import styles from "@/styles/components/auth/buttons.module.css";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import {
	accountTypeValidation,
	companyStepValidation,
	freelanceStepValidation,
} from "@/libs/utils";
import { useFormStatus } from "react-dom";

export default function Buttons({ step, setStep, isCompany, isWorker }) {
	const { pending } = useFormStatus();
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
	async function handleNext(e) {
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

	async function handleForm(e) {
		console.log("played");
		if (isCompany) {
			const isValidate = companyStepValidation();
			if (!isValidate) {
				e.preventDefault();
				return;
			}
		}
		if (isWorker) {
			const isValidate = freelanceStepValidation();
			if (!isValidate) {
				e.preventDefault();
				return;
			}
		}
		setStep(4);
	}

	return (
		<>
			<button
				id="previous"
				onClick={handlePrevious}
				className={clsx(montserrat.className, styles.previous)}>
				Retour
			</button>
			<button
				id="next"
				onClick={handleNext}
				className={clsx(montserrat.className, styles.next)}>
				Suivant
			</button>
			<button
				id="end"
				onClick={handleForm}
				disabled={pending}
				className={clsx(
					montserrat.className,
					styles.next,
					pending && "loading"
				)}>
				Terminer
			</button>
		</>
	);
}
