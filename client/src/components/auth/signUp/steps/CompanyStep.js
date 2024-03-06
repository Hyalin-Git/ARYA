import styles from "@/styles/components/auth/thirdStep.module.css";
import Buttons from "../buttons/Buttons";

export default function CompanyStep({ step, setStep, isCompany, isWorker }) {
	function handleFile(e) {
		e.preventDefault();
		const name = e?.target?.files[0]?.name;

		if (name === undefined) {
			document.getElementById("fileName").innerHTML = ".png / .jpg";
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
					entreprise
				</h2>
			</div>
			<div className={styles.form}>
				<div className={styles.labels}>
					<div>
						<label htmlFor="name">Nom</label>
						<span>*</span>
					</div>
					<div>
						<i className={styles.errorMsg} id="company-name-error"></i>
					</div>
				</div>
				<input
					onChange={(e) => {
						e.target.classList.remove(styles.error);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
					type="text"
					id="name"
					name="name"
					placeholder="Nom de l'entreprise"
					required
				/>
				<br />
				<br />
				<div className={styles.labels}>
					<div>
						<span className={styles.fakeLabel}>Logo </span>
						<span>*</span>
					</div>
					<div>
						<i className={styles.errorMsg} id="file-error"></i>
					</div>
				</div>
				<br />
				<div className={styles.file}>
					<input
						type="file"
						id="logo"
						name="logo"
						onChange={handleFile}
						accept="image/png, image/jpeg, image/jpg"
					/>
					<div>
						<span id="fileName">.png / .jpg</span>
					</div>
					<label id="addFile" htmlFor="logo">
						Choisir un fichier
					</label>
				</div>
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
					<option value="">Veuillez choisir votre activité</option>
					<option value="Audio">Audio</option>
					<option value="btp">BTP</option>
					<option value="Montage">Montage</option>
				</select>
				<br />
				<br />
				<label htmlFor="lookingForEmployees">Recrutez-vous ?</label>
				<span>*</span>
				<br />
				<div className={styles.choices}>
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
