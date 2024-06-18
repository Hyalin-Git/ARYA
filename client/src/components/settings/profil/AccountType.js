"use client";
import saveCompany from "@/actions/company";
import saveFreelance from "@/actions/freelance";
import ScheduleModal from "@/components/social/modals/ScheduleModal";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/accountType.module.css";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { mutate } from "swr";

const initialState = {
	status: "pending",
	message: "",
};

export default function AccountType() {
	const { uid } = useContext(AuthContext);
	const [isChecked, setIsChecked] = useState(false);
	const [isCompany, setIsCompany] = useState(false);
	const [isFreelance, setIsFreelance] = useState(false);
	const [availability, setAvailability] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");

	const saveFreelanceWithUid = saveFreelance.bind(null, uid, scheduledTime);
	const saveCompanyWithUid = saveCompany.bind(null, uid);
	const [state, formAction] = useFormState(
		isFreelance ? saveFreelanceWithUid : saveCompanyWithUid,
		initialState
	);
	function handleChoice(e) {
		e.preventDefault();
		const input = e.currentTarget.children[2];
		input.checked = true;
		console.log(input);
		setIsChecked(true);
		setIsCompany(false);
		setIsFreelance(false);
		if (input.id === "company") setIsCompany(true);
		if (input.id === "freelance") setIsFreelance(true);
	}
	function handleCancel(e) {
		e.preventDefault();

		setIsChecked(false);
		setIsCompany(false);
		setIsFreelance(false);
		const inputs = document.getElementsByName("choice");
		inputs[0].checked = false;
		inputs[1].checked = false;
	}
	useEffect(() => {
		if (state.status === "success") {
			setIsChecked(false);
			setIsCompany(false);
			setIsFreelance(false);
			const inputs = document.getElementsByName("choice");
			inputs[0].checked = false;
			inputs[1].checked = false;
			mutate("/login/success");
		}
	}, [state]);
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
								Le compte entreprise, vous permettra de recruter des employés
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
				{isChecked && isCompany && <Company handleCancel={handleCancel} />}
				{isChecked && isFreelance && (
					<Freelance
						handleCancel={handleCancel}
						setScheduledTime={setScheduledTime}
					/>
				)}
			</form>
		</div>
	);
}

export function Company({ handleCancel }) {
	return (
		<>
			<div className={styles.modal} id="modal">
				<div>
					<span>Compte Entreprise</span>
				</div>
				<div className={styles.inputs}>
					<div>
						<label htmlFor="name">Nom de l'entreprise</label>
						<input type="text" id="name" name="name" />
					</div>
					<div className={styles.file}>
						<label htmlFor="image">Choisir un fichier</label>
						<input
							type="file"
							id="image"
							name="image"
							accept="image/png, image/jpeg, image/jpg"
						/>
					</div>
					<div>
						<label htmlFor="activity">Secteur d'activité</label>
						<input type="text" id="activity" name="activity" />
					</div>
					<div>
						<label htmlFor="biographie">Biographie</label>
						<textarea
							type="text"
							id="biographie"
							name="biographie"
							className={montserrat.className}
							onChange={(e) => {
								e.preventDefault();
								e.target.style.height = "";
								e.target.style.height = e.target.scrollHeight + "px";
							}}
						/>
					</div>
					<div className={styles.lookingForEmployees}>
						<label htmlFor="lookingForEmployees">
							Êtes-vous à la recherche d'employés ?
						</label>
						<input
							type="checkbox"
							id="lookingForEmployees"
							name="lookingForEmployees"
						/>
					</div>
				</div>
				<div className={styles.buttons}>
					<button className={montserrat.className} onClick={handleCancel}>
						Annuler
					</button>
					<button className={montserrat.className}>Confirmer</button>
				</div>
			</div>
			<div id="overlay" onClick={handleCancel}></div>
		</>
	);
}

export function Freelance({ handleCancel, setScheduledTime }) {
	const months = moment.months();
	const actualMonth = moment().format("MMMM");
	const days = Array.from(Array(moment().daysInMonth()).keys());
	const actualDay = moment().date();
	const actualYear = moment().get("year");

	function handleScheduledTime(e) {
		const getMonth = document.getElementById("months").value;
		const getDay = document.getElementById("days").value;
		const getYear = document.getElementById("years").value;

		console.log(getDay);

		setScheduledTime(getYear + "-" + getMonth + "-" + getDay);
	}

	const [isCv, setIsCv] = useState(false);
	const [isLookingForJob, setIsLookingForJob] = useState(false);
	function handleCv(e) {
		console.log(e.target.files[0]);
		const file = e.target.files[0];
		if (file) {
			setIsCv(true);
		} else {
			setIsCv(false);
		}
	}
	function handleLookingForJob(e) {
		const isChecked = e.target.checked;
		if (isChecked) {
			setIsLookingForJob(true);
		} else {
			setIsLookingForJob(false);
		}
	}
	return (
		<>
			<div className={styles.modal} id="modal">
				<div>
					<span>Compte Freelance</span>
				</div>
				<div className={styles.inputs}>
					<div className={styles.file}>
						<label htmlFor="cv">Ajouter un CV</label>
						<input
							type="file"
							id="cv"
							name="cv"
							accept="application/pdf"
							onChange={handleCv}
						/>
					</div>
					{isCv && (
						<div className={styles.checkbox}>
							<div>
								<label htmlFor="privacy">
									Rendre le CV publique ? <em>(recommandé)</em>
								</label>
							</div>
							<div>
								<input type="checkbox" id="privacy" name="privacy" />
							</div>
						</div>
					)}
					<div className={styles.checkbox}>
						<div>
							<label htmlFor="lookingForJob">
								Êtes-vous à la recherche d'un emploi ?
							</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="lookingForJob"
								name="lookingForJob"
								onChange={handleLookingForJob}
							/>
						</div>
					</div>
					{isLookingForJob && (
						<div>
							<div>
								<span>à partir de quand êtes vous disponible ?</span>
							</div>
							<div>
								<span>Mois</span>
								<select name="months" id="months" form="post">
									{months.map((month, idx) => {
										const trueMonth = idx + 1;
										const formattedMonth = () => {
											return month.charAt(0).toUpperCase() + month.slice(1);
										};
										return (
											<option
												value={trueMonth.toString().padStart(2, "0")}
												key={idx}>
												{formattedMonth()}
											</option>
										);
									})}
								</select>
							</div>
							<div className={styles.input}>
								<span>Jour</span>
								<select name="days" id="days" form="post" value={actualDay}>
									{days.map((day, idx) => {
										const formattedDay = () => {
											const trueDay = day + 1;
											return trueDay.toString().padStart(2, "0");
										};

										return (
											<option value={formattedDay()} key={idx}>
												{formattedDay()}
											</option>
										);
									})}
								</select>
							</div>
							<div className={styles.input}>
								<span>Année</span>
								<select name="years" id="years" form="post">
									<option value={actualYear}>{actualYear}</option>
									<option value={actualYear + 1}>{actualYear + 1}</option>
								</select>
							</div>
						</div>
					)}
				</div>
				<div className={styles.buttons}>
					<button className={montserrat.className} onClick={handleCancel}>
						Annuler
					</button>
					<button
						className={montserrat.className}
						onClick={handleScheduledTime}>
						Confirmer
					</button>
				</div>
			</div>
			<div id="overlay" onClick={handleCancel}></div>
		</>
	);
}
