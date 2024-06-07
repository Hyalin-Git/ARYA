import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/accountType.module.css";
import { useState } from "react";
export default function AccountType() {
	const [isChecked, setIsChecked] = useState(false);
	function handleChoice(e) {
		e.preventDefault();
		const input = e.currentTarget.children[2];
		input.checked = true;
		console.log(input);
		setIsChecked(true);
	}
	function handleCancel(e) {
		e.preventDefault();

		setIsChecked(false);
		const inputs = document.getElementsByName("choice");
		inputs[0].checked = false;
		inputs[1].checked = false;
	}
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Type de compte</span>
			</div>
			<form action="">
				<div className={styles.form}>
					<div onClick={handleChoice}>
						<div>
							<span>Entreprise</span>
						</div>
						<div>
							<p>
								Le compte freelance, vous permettra de chercher du travail
								auprès des entreprises, vous pourrez ajouter votre CV etc
							</p>
						</div>
						<input
							type="radio"
							name="choice"
							id="company"
							value="company"
							hidden
						/>
					</div>
					<div onClick={handleChoice}>
						<div>
							<span>Freelance</span>
						</div>
						<div>
							<p>
								Le compte freelance, vous permettra de chercher du travail
								auprès des entreprises, vous pourrez ajouter votre CV etc
							</p>
						</div>
						<input
							type="radio"
							name="choice"
							id="freelance"
							value="freelance"
							hidden
						/>
					</div>
				</div>
				{isChecked && (
					<div className={styles.button}>
						<button className={montserrat.className} onClick={handleCancel}>
							Annuler
						</button>
						<button type="submit" className={montserrat.className}>
							Confirmer
						</button>{" "}
					</div>
				)}
			</form>
		</div>
	);
}
