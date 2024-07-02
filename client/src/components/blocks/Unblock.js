"use client";
import styles from "@/styles/components/block/block.module.css";
import { unblockUser } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useFormState } from "react-dom";
const initialState = {
	status: "pending",
	message: "",
	error: [],
};
export default function Unblock({ idToUnblock, text }) {
	const { uid } = useContext(AuthContext);
	const unblockUserWithUid = unblockUser.bind(null, uid);
	const [state, formAction] = useFormState(unblockUserWithUid, initialState);
	return (
		<form action={formAction} className={styles.form}>
			<input
				type="text"
				hidden
				name="idToUnblock"
				id="idToUnblock"
				value={idToUnblock}
			/>
			<button type="submit" data-text={text}>
				{text === true ? "Débloquer" : <FontAwesomeIcon icon={faXmark} />}
			</button>
		</form>
	);
}
