"use client";
import saveFreelance from "@/actions/freelance";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/accountType.module.css";
import { useContext, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
};

export default function AccountType() {
	const { uid } = useContext(AuthContext);
	const [isChecked, setIsChecked] = useState(false);
	const saveFreelanceWithUid = saveFreelance.bind(null, uid);
	const [state, formAction] = useFormState(saveFreelanceWithUid, initialState);
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
			<form action={formAction}>
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
					<>
						<div id="modal">
							<h1>yas</h1>
						</div>
						<div id="overlay"></div>
					</>
				)}
			</form>
		</div>
	);
}
