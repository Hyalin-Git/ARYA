import Image from "next/image";
import styles from "@/styles/components/auth/companyStep.module.css";
import Buttons from "./Buttons";

export default function CompanyStep({ step, setStep }) {
	function handlePreview(e) {
		e.preventDefault();

		const [file] = e.currentTarget.files;

		if (file) {
			const preview = document.getElementById("preview");
			preview.style.display = "block";
			preview.src = URL.createObjectURL(file);
		}
	}
	function handleChoices(e) {
		e.preventDefault();
		const input = e.currentTarget.children[0];
		input.checked = true;
	}
	return (
		<>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté</h1>
				<h2>
					Veuillez fournir des informations complémentaire pour votre entreprise
				</h2>
			</div>
			<div className={styles.form}>
				<label htmlFor="name">Nom</label>
				<br />
				<input type="text" id="name" name="name" required />
				<br />
				<br />
				<label htmlFor="logo">Logo</label>
				<br />

				<div className={styles.logo}>
					<Image src="" width={65} height={65} id="preview" alt="preview" />
					<input
						type="file"
						id="logo"
						name="logo"
						onChange={handlePreview}
						required
					/>
				</div>
				<br />

				<label htmlFor="activity">Secteur d'activité</label>
				<br />
				<select name="activity" id="activity">
					<option value="Audio">Audio</option>
					<option value="btp">BTP</option>
					<option value="Montage">Montage</option>
				</select>

				<br />
				<br />
				<label htmlFor="lookingForEmployees">Recrutez-vous ?</label>

				<div className={styles.recruiting}>
					<div onClick={handleChoices}>
						<input
							type="radio"
							name="lookingForEmployees"
							id="lookingForEmployeesYes"
							value="yes"
						/>
						<label htmlFor="lookingForEmployeesYes">Oui</label>
					</div>
					<div onClick={handleChoices}>
						<input
							type="radio"
							name="lookingForEmployees"
							id="lookingForEmployeesNo"
							value="no"
						/>
						<label htmlFor="lookingForEmployeesNo">Non</label>
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<Buttons step={step} setStep={setStep} />
			</div>
		</>
	);
}
