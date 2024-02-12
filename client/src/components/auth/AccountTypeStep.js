import styles from "@/styles/components/auth/accountType.module.css";
import clsx from "clsx";
import Buttons from "./Buttons";

export default function AccountType({
	setIsCompany,
	setIsWorker,
	step,
	setStep,
}) {
	function handleChoice(e, id) {
		e.preventDefault();
		const choices = document.getElementsByClassName("choices");
		const input = document.getElementById(id);
		input.checked = true;

		if (input.id === "company") {
			setIsCompany(true);
			setIsWorker(false);
		}

		if (input.id === "freelance") {
			setIsCompany(false);
			setIsWorker(true);
		}

		for (const choice of choices) {
			const input = choice.children[2];
			choice.classList.toggle(styles.checked, input.checked);
		}
	}

	return (
		<>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté</h1>
				<h2>Quel type de compte souhaitez vous créer ?</h2>
			</div>
			<div className={styles.form}>
				<div
					className={clsx("choices")}
					onClick={(e) => handleChoice(e, "company")}
					data-checked={false}>
					<h3>Entreprise</h3>
					<p>
						Le compte travail, vous permettra de chercher du travail auprès des
						entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input
						className={styles.input}
						type="radio"
						name="accountType"
						id="company"
						value="company"
					/>
				</div>
				<br />

				<div
					className={clsx("choices")}
					onClick={(e) => handleChoice(e, "freelance")}
					data-checked={false}>
					<h3>Freelance</h3>
					<p>
						Le compte freelance, vous permettra de chercher du travail auprès
						des entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input
						className={styles.input}
						type="radio"
						name="accountType"
						id="freelance"
						value="freelance"
					/>
				</div>
				<br />
				<div
					className={clsx("choices")}
					onClick={(e) => handleChoice(e, "other")}
					data-checked={false}>
					<h3>Autre</h3>
					<p>
						Le compte autre, vous permettra de chercher du travail auprès des
						entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input
						className={styles.input}
						type="radio"
						name="accountType"
						id="other"
						value="other"
					/>
				</div>
			</div>
			<div className={styles.buttons}>
				<Buttons step={step} setStep={setStep} />
			</div>
		</>
	);
}
