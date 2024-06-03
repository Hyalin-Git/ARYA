import styles from "@/styles/components/settings/cvEditor.module.css";
export default function CvEditor() {
	return (
		<div className={styles.container}  id="panel">
			<div className={styles.title}>
				<span>Curriculum vitae</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="cv">
						Souhaitez-vous rendre votre CV publique ? <em>(recommander)</em>
					</label>
					<input type="checkbox" name="cv" id="cv" />
				</div>
				<div>
					<label htmlFor="email">Adresse mail de contact</label>
					<br />
					<input type="email" name="email" id="email" />
				</div>
			</div>
		</div>
	);
}
