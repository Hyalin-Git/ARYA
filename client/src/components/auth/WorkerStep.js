import styles from "@/styles/components/auth/thirdStep.module.css";
import Buttons from "./Buttons";
export default function WorkerStep({ step, setStep, isCompany, isWorker }) {
	function handleFile(e) {
		const { name } = e.target.files[0];
		console.log(e.target.files);

		document.getElementById("fileName").innerHTML = name;
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
					Veuillez fournir des informations complémentaire pour votre work
				</h2>
			</div>
			<div className={styles.form}>
				<span className={styles.fakeLabel}>Veuillez joindre votre CV</span>
				<br />
				<br />
				<div className={styles.file}>
					<input
						onChange={handleFile}
						type="file"
						id="cv"
						name="cv"
						accept="application/pdf"
					/>
					<div>
						<span id="fileName"></span>
					</div>
					<label id="addFile" htmlFor="cv">
						Choisir un fichier
					</label>
				</div>
				<br />
				<br />
				<label htmlFor="portfolio">Un lien vers votre portfolio ?</label>
				<br />
				<input
					type="text"
					id="portfolio"
					name="portfolio"
					placeholder="https://portfolio.fr"
				/>
				<br />
				<br />
				<label htmlFor="activity">Secteur d'activité</label>
				<span>*</span>
				<br />
				<select name="activity" id="activity">
					<option value="">Veuillez choisir votre secteur d'activité</option>
					<option value="Audio">Audio</option>
					<option value="btp">BTP</option>
					<option value="Montage">Montage</option>
				</select>
				<br />
				<br />
				<label htmlFor="lookingForEmployees">
					Êtes-vous à la recherche d'emploi ?
				</label>
				<span>*</span>
				<div className={styles.choices}>
					<div onClick={handleChoices}>
						<input
							type="radio"
							name="lookingForJob"
							id="lookingForJobYes"
							value="yes"
						/>
						<label htmlFor="lookingForJobYes">Oui</label>
					</div>
					<div onClick={handleChoices}>
						<input
							type="radio"
							name="lookingForJob"
							id="lookingForJobNo"
							value="no"
						/>
						<label htmlFor="lookingForJobNo">Non</label>
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<Buttons
					step={step}
					setStep={setStep}
					isCompany={isCompany}
					isWorker={isWorker}
				/>
			</div>
		</>
	);
}
