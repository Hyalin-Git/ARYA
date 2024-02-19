import styles from "@/styles/components/auth/stepTracker.module.css";
import clsx from "clsx";
export default function StepTracker({ step }) {
	return (
		<div className={styles.container}>
			<div className={styles.tracker} data-step={step}></div>
		</div>
	);
}
