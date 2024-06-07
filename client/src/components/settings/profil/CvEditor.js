"use client";
import styles from "@/styles/components/settings/profil/cvEditor.module.css";
import { useState } from "react";
export default function CvEditor() {
	const [isDragging, setIsDragging] = useState();
	const [file, setFile] = useState();
	function dropped(e) {
		e.preventDefault();
		setFile(e.dataTransfer.files[0]);
		setIsDragging(false);
	}

	function dragEnter(e) {
		e.preventDefault();
		setIsDragging(true);
	}

	function dragLeave(e) {
		e.preventDefault();
		setIsDragging(false);
	}
	function dragOver(e) {
		e.preventDefault();
	}
	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Curriculum vitae</span>
			</div>
			<div className={styles.form}>
				<div>
					<label htmlFor="">
						Souhaitez-vous rendre votre CV publique ? <em>(recommander)</em>
					</label>
					<input type="checkbox" name="dikc" id="dick" />
				</div>
				<div>
					<br />
					<div
						className={styles.zone}
						onDrop={dropped}
						onDragLeave={dragLeave}
						onDragEnter={dragEnter}
						onDragOver={dragOver}
						data-dragging={isDragging}>
						<span>
							Déposer votre CV ici <br />
						</span>
						<span>ou</span>
						<label htmlFor="cv">Parcourir les fichiers</label>
						<input
							type="file"
							name="cv"
							id="cv"
							onChange={(e) => {
								e.preventDefault();
								const files = e.target.files[0];
								setFile(files);
							}}
							hidden
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
