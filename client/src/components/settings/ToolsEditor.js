import styles from "@/styles/components/settings/socialEditor.module.css";
export default function ToolsEditor() {
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Outils</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="email">Adresse mail de contact</label>
					<br />
					<input type="email" name="email" id="email" />
				</div>
				<div></div>
			</div>
		</div>
	);
}
