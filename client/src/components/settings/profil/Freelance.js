"use client";
import { updateFreelance } from "@/actions/freelance";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/cvEditor.module.css";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { mutate } from "swr";
const initialState = {
	status: "pending",
	message: "",
};

export default function Freelance() {
	const { uid, user } = useContext(AuthContext);
	const [editCV, setEditCV] = useState(false);
	const [isLookingForJob, setIsLookingForJob] = useState(false);
	const [scheduledTime, setScheduledTime] = useState("");
	const hasCv = user?.freelance?.cv?.pdf;
	const isPrivate = user?.freelance?.cv?.private;
	const months = moment.months();
	const actualMonth = moment().format("MMMM");
	const days = Array.from(Array(moment().daysInMonth()).keys());
	const actualDay = moment().date();
	const actualYear = moment().get("year");
	const updateFreelanceWithUid = updateFreelance.bind(null, uid, scheduledTime);
	const [state, formAction] = useFormState(
		updateFreelanceWithUid,
		initialState
	);
	const downloadLink = hasCv?.replace("/upload/", "/upload/fl_attachment/");

	useEffect(() => {
		if (state.status === "success") {
			console.log("yas queen ");
			mutate("/login/success");
		}
		const checked = document.getElementById("lookingForJob").checked;

		if (checked) setIsLookingForJob(true);
	}, [state]);

	function handleScheduledTime(e) {
		const getMonth = document.getElementById("months")?.value;
		const getDay = document.getElementById("days")?.value;
		const getYear = document.getElementById("years")?.value;

		setScheduledTime(getYear + "-" + getMonth + "-" + getDay);
	}

	const [isDragging, setIsDragging] = useState();
	const [file, setFile] = useState();
	function dropped(e) {
		e.preventDefault();
		setFile(e.dataTransfer.files[0]);
		setIsDragging(false);
	}

	function dragEnter(e) {
		e.preventDefault();
		setIsDragging(true);
	}

	function dragLeave(e) {
		e.preventDefault();
		setIsDragging(false);
	}
	function dragOver(e) {
		e.preventDefault();
	}

	async function handleChange() {
		await handleScheduledTime();
		document.getElementById("freelance").requestSubmit();
	}
	const userMonth = user?.freelance?.availability?.split("-")[1];
	const userDay = user?.freelance?.availability?.split("-")[2]?.split("T")[0];
	console.log();
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Freelance</span>
			</div>
			<form action={formAction} id="freelance">
				<div className={styles.form}>
					<div className={styles.checkbox}>
						<label htmlFor="privacy">
							Souhaitez-vous rendre votre CV publique ? <em>(recommander)</em>
						</label>
						<input
							type="checkbox"
							name="privacy"
							id="privacy"
							onChange={handleChange}
							defaultChecked={isPrivate === false ? true : false}
						/>
					</div>
					{!hasCv && (
						<>
							<br />
							<div
								className={styles.zone}
								onDrop={dropped}
								onDragLeave={dragLeave}
								onDragEnter={dragEnter}
								onDragOver={dragOver}
								data-dragging={isDragging}>
								<span>
									Déposer votre CV ici <br />
								</span>
								<span>ou</span>
								<label htmlFor="cv">Parcourir les fichiers</label>
								<input
									type="file"
									name="cv"
									id="cv"
									onChange={(e) => {
										e.preventDefault();
										const files = e.target.files[0];
										setFile(files);
										handleChange();
									}}
									hidden
								/>
							</div>
							<br />
						</>
					)}
					{editCV && (
						<>
							<br />
							<div
								className={styles.zone}
								onDrop={dropped}
								onDragLeave={dragLeave}
								onDragEnter={dragEnter}
								onDragOver={dragOver}
								data-dragging={isDragging}>
								<span>
									Déposer votre CV ici <br />
								</span>
								<span>ou</span>
								<label htmlFor="cv">Parcourir les fichiers</label>
								<input
									type="file"
									name="cv"
									id="cv"
									onChange={(e) => {
										e.preventDefault();
										const files = e.target.files[0];
										setFile(files);
										handleChange();
									}}
									hidden
								/>
							</div>
							<br />
						</>
					)}
					{hasCv && !editCV && (
						<div className={styles.buttons}>
							<button className={montserrat.className}>
								<a href={downloadLink} download>
									Télécharger mon CV
								</a>
							</button>

							<button
								className={montserrat.className}
								onClick={() => setEditCV(true)}>
								Changer mon CV
							</button>
						</div>
					)}
					<div className={styles.checkbox}>
						<label htmlFor="lookingForJob">
							Êtes-vous à la recherche d'un emploi ?
						</label>
						<input
							type="checkbox"
							name="lookingForJob"
							id="lookingForJob"
							defaultChecked={user?.freelance.lookingForJob}
							onChange={handleChange}
							onClick={() => setIsLookingForJob(!isLookingForJob)}
						/>
					</div>
					{isLookingForJob && (
						<>
							<br />
							<div className={styles.title}>
								<span>à partir de quand êtes vous disponible ?</span>
							</div>
							<div className={styles.date}>
								<div>
									<label htmlFor="months">Mois</label>
									<br />
									<select name="months" id="months" onChange={handleChange}>
										{months.map((month, idx) => {
											const trueMonth = idx + 1;
											const formattedMonth = () => {
												return month.charAt(0).toUpperCase() + month.slice(1);
											};
											return (
												<option
													value={trueMonth.toString().padStart(2, "0")}
													key={idx}
													selected={
														trueMonth.toString().padStart(2, "0") === userMonth
													}>
													{formattedMonth()}
												</option>
											);
										})}
									</select>
								</div>
								<div className={styles.input}>
									<label htmlFor="days">Jour</label>
									<br />
									<select name="days" id="days" onChange={handleChange}>
										{days.map((day, idx) => {
											const formattedDay = () => {
												const trueDay = day + 1;
												return trueDay.toString().padStart(2, "0");
											};

											return (
												<option
													value={formattedDay()}
													key={idx}
													selected={formattedDay() === userDay}>
													{formattedDay()}
												</option>
											);
										})}
									</select>
								</div>
								<div className={styles.input}>
									<label htmlFor="years">Année</label>
									<br />
									<select name="years" id="years" onChange={handleChange}>
										<option value={actualYear}>{actualYear}</option>
										<option value={actualYear + 1}>{actualYear + 1}</option>
									</select>
								</div>
							</div>
						</>
					)}
				</div>
			</form>
		</div>
	);
}
