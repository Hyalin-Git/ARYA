import styles from "@/styles/components/auth/thirdStep.module.css";
import Buttons from "../buttons/Buttons";
export default function WorkerStep({ step, setStep, isCompany, isWorker }) {
	function handleFile(e) {
		const name = e?.target?.files[0]?.name;

		if (name === undefined) {
			document.getElementById("fileName").innerHTML = ".pdf";
			document.getElementById("fileName").style.color = "grey";
		} else {
			document.getElementById("fileName").innerHTML = name;
			document.getElementById("fileName").style.color = "white";
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
					Veuillez fournir des informations complémentaire pour votre compte
					freelance
				</h2>
			</div>
			<div className={styles.form}>
				<div className={styles.labels}>
					<div>
						<span className={styles.fakeLabel}>Joindre un CV </span>
						<span>*</span>
					</div>
					<div>
						<i className={styles.errorMsg} id="file-error"></i>
					</div>
				</div>
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
						<span id="fileName">.pdf</span>
					</div>
					<label id="addFile" htmlFor="cv">
						Choisir un fichier
					</label>
				</div>
				<br />
				<br />
				<div className={styles.labels}>
					<div>
						<label htmlFor="portfolio">Un lien vers votre portfolio ?</label>
					</div>
					<div>
						<i className={styles.errorMsg} id="portfolio-error"></i>
					</div>
				</div>
				<input
					type="text"
					id="portfolio"
					name="portfolio"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
					placeholder="https://portfolio.fr"
				/>
				<br />
				<br />
				<div className={styles.labels}>
					<div>
						<label htmlFor="activity">Secteur d'activité</label>
						<span>*</span>
					</div>
					<div>
						<i className={styles.errorMsg} id="activity-error"></i>
					</div>
				</div>
				<select name="activity" id="activity">
					<option value="">Veuillez choisir votre secteur d'activité</option>
					<option value="Audio">Audio</option>
					<option value="btp">BTP</option>
					<option value="Montage">Montage</option>
				</select>
				<br />
				<br />
				<label htmlFor="lookingForJob">
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
