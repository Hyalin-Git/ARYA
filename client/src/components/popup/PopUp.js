import clsx from "clsx";
import styles from "@/styles/components/popup/popUp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleCheck,
	faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
export default function PopUp({ status, title, message }) {
	useEffect(() => {
		const popup = document.getElementById("popup");
		popup?.classList?.remove(styles.disapear);

		popup?.addEventListener("animationend", function (e) {
			setTimeout(() => {
				popup?.classList?.add(styles.disapear);
			}, 3800);
		});
	}, []);
	return (
		<div
			className={clsx(
				status === "success" ? styles.success : styles.failure,
				styles.container
			)}
			id="popup">
			<div className={styles.icon}>
				{status === "success" ? (
					<FontAwesomeIcon icon={faCircleCheck} />
				) : (
					<FontAwesomeIcon icon={faCircleXmark} />
				)}
			</div>
			<div className={styles.text}>
				<div>
					<h3>{title}</h3>
				</div>
				<div>
					<p>{message}</p>
				</div>
			</div>
		</div>
	);
}
