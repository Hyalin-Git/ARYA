import styles from "@/styles/components/settings/profil/cvEditor.module.css";

export default function LookingForJobEditor() {
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Service</span>
			</div>
			<div className={styles.form}>
				<div>
					{/* <label htmlFor="cv">Offrez-vous vos service ?</label>
					<input type="checkbox" name="cv" id="cv" /> */}
				</div>
				{/* <div>
					<label htmlFor="email">Vos disponibilités</label>
					<br />
				</div> */}
			</div>
		</div>
	);
}
