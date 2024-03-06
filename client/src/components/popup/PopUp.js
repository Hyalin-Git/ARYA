import clsx from "clsx";
import styles from "@/styles/components/popup/popUp.module.css";
import { useEffect, useMemo, useState } from "react";
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
			<div>
				<h3>{title}</h3>
			</div>
			<div>
				<p>{message}</p>
			</div>
		</div>
	);
}
