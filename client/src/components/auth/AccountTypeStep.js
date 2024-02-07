import styles from "@/styles/components/auth/accountType.module.css";
import clsx from "clsx";
import StepTracker from "./StepTracker";
import { montserrat } from "@/libs/fonts";
import Buttons from "./Buttons";

export default function AccountType({ setIsCompany, setIsWorker, setStep }) {
	function handleChoice(e, id) {
		e.preventDefault();
		const choices = document.getElementsByClassName("choices");
		const input = document.getElementById(id);
		input.checked = true;

		if (input.id === "company") {
			setIsCompany(true);
			setIsWorker(false);
		}

		if (input.id === "worker") {
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
					<h3>Tu veux monter une entreprise ?</h3>
					<p>
						Le compte travail, vous permettra de chercher du travail auprès des
						entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input type="radio" name="accountType" id="company" value="company" />
				</div>
				<br />
				<div
					className={clsx("choices")}
					onClick={(e) => handleChoice(e, "worker")}
					data-checked={false}>
					<h3>Tu cherche un travail ?</h3>
					<p>
						Le compte travail, vous permettra de chercher du travail auprès des
						entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input type="radio" name="accountType" id="worker" value="worker" />
				</div>
			</div>
			<Buttons setStep={setStep} />
		</>
	);
}
