import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/stepOne.module.css";
import clsx from "clsx";
import StepTracker from "./StepTracker";

export default function StepOne() {
	function handleType(e, id) {
		e.preventDefault();
		const choices = document.getElementsByClassName("choices");
		const input = document.getElementById(id);
		input.checked = true;

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
					onClick={(e) => handleType(e, "company")}
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
					onClick={(e) => handleType(e, "worker")}
					data-checked={false}>
					<h3>Tu cherche un travail ?</h3>
					<p>
						Le compte travail, vous permettra de chercher du travail auprès des
						entreprises, vous pourrez ajouter votre CV etc
					</p>
					<input type="radio" name="accountType" id="worker" value="worker" />
				</div>
			</div>
			<StepTracker step={1} />
			<div className={styles.buttons}>
				<button
					type="submit"
					className={clsx(montserrat.className, styles.skip)}>
					Passer les étapes
				</button>
				<button className={clsx(montserrat.className, styles.previous)}>
					Retour
				</button>
				<button className={clsx(montserrat.className, styles.next)}>
					Suivant
				</button>
			</div>
		</>
	);
}
