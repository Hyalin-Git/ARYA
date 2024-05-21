import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/social/modals/scheduleModal.module.css";
import moment from "moment";
export default function ScheduleModal({ setOpenSchedule, setScheduledTime }) {
	const months = moment.months();
	const actualMonth = moment().format("MMMM");
	const days = Array.from(Array(moment().daysInMonth()).keys());
	const actualDay = moment().date();
	const actualHour = moment().get("hour");
	const actualMinute = moment().get("minute");
	const actualYear = moment().get("year");

	function handleScheduledTime(e) {
		e.preventDefault();
		const getMonth = document.getElementById("months").value;
		const getDay = document.getElementById("days").value;
		const getYear = document.getElementById("years").value;
		const getHour = document.getElementById("hours").value;
		const getMinute = document.getElementById("minutes").value;
		console.log(getDay);

		setScheduledTime(
			getYear + "-" + getMonth + "-" + getDay + " " + getHour + ":" + getMinute
		);
	}

	const hours = [];
	for (let i = 0; i <= 23; i++) {
		hours.push(i.toString().padStart(2, "0"));
	}
	const minutes = [];
	for (let i = 0; i <= 59; i++) {
		minutes.push(i.toString().padStart(2, "0"));
	}

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
					</div>
					<div className={styles.time}>
						<span>Temps</span>
						<br />
						<div className={styles.wrapper}>
							<div className={styles.input}>
								<span>Heure</span>
								<select name="hours" id="hours" form="post">
									{hours.map((hour, idx) => {
										return (
											<option value={hour} key={idx}>
												{hour}
											</option>
										);
									})}
								</select>
							</div>
							<div className={styles.input}>
								<span>Minute</span>
								<select name="minutes" id="minutes" form="post">
									{minutes.map((minute, idx) => {
										return (
											<option value={minute} key={idx}>
												{minute}
											</option>
										);
									})}
								</select>
							</div>

							<button
								onClick={handleScheduledTime}
								className={montserrat.className}>
								Programmer
							</button>
						</div>
					</div>
				</div>
			</div>
			<div id="hiddenOverlay" onClick={(e) => setOpenSchedule(false)}></div>
		</>
	);
}
