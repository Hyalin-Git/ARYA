"use client";
import { updateUserTools } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import styles from "@/styles/components/settings/profil/toolsEditor.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
	data: [],
};
export default function ToolsEditor() {
	const { user, uid } = useContext(AuthContext);
	const tools = user?.tools;
	const [displayedTools, setDisplayedTools] = useState();
	const updateUserToolWithParams = updateUserTools.bind(
		null,
		uid,
		displayedTools
	);
	const [state, formAction] = useFormState(
		updateUserToolWithParams,
		initialState
	);

	async function deleteTool(e) {
		const value = e.target.innerText;
		const filteredTools = displayedTools.filter((a) => a !== value);
		setDisplayedTools(filteredTools);

		console.log(filteredTools);

		await updateUserTools(uid, filteredTools);
	}

	useEffect(() => {
		if (state?.status === "success") {
			document.getElementById("tool").value = "";
			setDisplayedTools(state?.data);
		} else {
			if (displayedTools === undefined) {
				setDisplayedTools(tools);
			}
		}
		console.log(state?.data);
	}, [state, tools]);
	return (
		<div className={styles.container} id="tools">
			<div className={styles.title}>
				<span>Outils</span>
			</div>
			<div className={styles.tools}>
				{displayedTools?.map((tool, idx) => {
					return (
						<span key={idx} onClick={deleteTool}>
							{tool}
						</span>
					);
				})}
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<label htmlFor="tool">Ajouter des outils</label>
					<br />
					<input type="tool" name="tool" id="tool" />
					<button hidden type="submit">
						submit
					</button>
				</form>
			</div>
		</div>
	);
}
