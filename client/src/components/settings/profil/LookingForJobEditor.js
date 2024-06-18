import styles from "@/styles/components/settings/profil/cvEditor.module.css";

export default function LookingForJobEditor() {
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Disponibilité</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="lookingForJob">
						Êtes-vous à la recherche d'un emploi ?
					</label>
					<input type="checkbox" name="lookingForJob" id="lookingForJob" />
				</div>

				{/* <div>
					<label htmlFor="email">Vos disponibilités</label>
					<br />
				</div> */}
			</div>
		</div>
	);
}
