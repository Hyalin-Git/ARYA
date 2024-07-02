"use client";
import styles from "@/styles/components/block/block.module.css";
import { blockUser } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useFormState } from "react-dom";
import { montserrat } from "@/libs/fonts";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};

export default function Block({ idToBlock, text }) {
	const { uid } = useContext(AuthContext);
	const unblockUserWithUid = blockUser.bind(null, uid);
	const [state, formAction] = useFormState(unblockUserWithUid, initialState);
	console.log(idToBlock, "block or not");
	return (
		<form action={formAction} className={styles.form}>
			<input
				type="text"
				hidden
				name="idToBlock"
				id="idToBlock"
				value={idToBlock}
			/>
			<button type="submit" className={montserrat.className}>
				Bloquer
			</button>
		</form>
	);
}
