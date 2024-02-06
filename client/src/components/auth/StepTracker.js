import styles from "@/styles/components/auth/stepTracker.module.css";
import clsx from "clsx";
export default function StepTracker({ step }) {
	return (
		<div className={styles.container}>
			<div className={styles.tracker}>
				<div className={clsx(step >= 1 ? styles.active : styles.unactive)}>
					1
				</div>
				<div className={clsx(step >= 2 ? styles.active : styles.unactive)}>
					2
				</div>
				<div className={clsx(step >= 3 ? styles.active : styles.unactive)}>
					3
				</div>
			</div>
		</div>
	);
}
