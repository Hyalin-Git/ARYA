import { montserrat } from "@/libs/fonts";
import styles from "@/styles/layouts/social/scheduleModal.module.css";
import moment from "moment";
export default function ScheduleModal({ setOpenSchedule }) {
	const months = moment.months();
	const actualMonth = moment().month();
	console.log(actualMonth);
	const days = Array.from(Array(moment().daysInMonth()).keys());
	const actualDay = moment().date();
	const actualHour = moment().get("hour");
	const actualMinute = moment().get("minute");

	return (
		<>
			<div className={styles.container}>
				<div className={styles.header}>
					<span>Programmer votre publication</span>
				</div>
				<div className={styles.content}>
					<div className={styles.date}>
						<span>Date</span>
						<br />
						<div className={styles.wrapper}>
							<div className={styles.input}>
								<span>Mois</span>
								<select name="months" id="months" form="post">
									{months.map((month, idx) => {
										const formattedMonth = () => {
											return month.charAt(0).toUpperCase() + month.slice(1);
										};
										return (
											<option
												value={idx + 1}
												key={idx}
												selected={idx + 1 == actualMonth + 1}>
												{formattedMonth()}
											</option>
										);
									})}
								</select>
							</div>
							<div className={styles.input}>
								<span>Jour</span>
								<select name="days" id="days" form="post">
									{days.map((day, idx) => {
										return (
											<option
												value={day + 1}
												key={idx}
												selected={day + 1 === actualDay}>
												{day + 1}
											</option>
										);
									})}
								</select>
							</div>
							<div className={styles.input}>
								<span>Année</span>
								<select name="year" id="moyearnths" form="post">
									<option value="dog">2024</option>
									<option value="cat">2025</option>
								</select>
							</div>
						</div>
					</div>
					<div className={styles.time}>
						<span>Temps</span>
						<br />
						<div className={styles.wrapper}>
							<div className={styles.input}>
								<span>Heure</span>
								<select name="days" id="days" form="post">
									<option value="dog">01</option>
									<option value="cat">02</option>
								</select>
							</div>
							<div className={styles.input}>
								<span>Minute</span>
								<select name="year" id="year" form="post">
									<option value="dog">2024</option>
									<option value="cat">2025</option>
								</select>
							</div>

							<button className={montserrat.className}>Programmer</button>
						</div>
					</div>
				</div>
				{/* <div className={styles.footer}>
					<p>Votre publication est programmé pour le : 21 mai 2024 à 14h00</p>
				</div> */}
			</div>
			<div id="hiddenOverlay" onClick={(e) => setOpenSchedule(false)}></div>
		</>
	);
}
