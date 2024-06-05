"use client";
import styles from "@/styles/components/settings/cvEditor.module.css";
export default function CvEditor() {
	function dropped(e) {
		e.preventDefault();
		console.log("dick");
	}
	return (
		<div className={styles.container} id="panel">
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
					<br />
					<div className={styles.zone} onDrop={dropped}>
						<span>
							Déposer votre CV ici <br />
						</span>
						<span>ou</span>
						<label htmlFor="cv">Parcourir les fichiers</label>
						{/* <input type="file" name="cv" id="cv" hidden /> */}
					</div>
				</div>
			</div>
		</div>
	);
}
