import { updateMessage } from "@/actions/message";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/chat/updateMessage.module.css";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import socket from "@/libs/socket";
import { revalidateMessages } from "@/api/conversations/message";
import { mutate } from "swr";
const initialState = {
	status: "pending",
	message: "",
	error: [],
};
export default function UpdateMessage({
	conversationId,
	message,
	setEdit,
	uid,
}) {
	const updateMessageAction = updateMessage.bind(null, uid, message._id);
	const [state, formAction] = useFormState(updateMessageAction, initialState);

	useEffect(() => {
		if (state?.status === "success") {
			setEdit(false);
			socket.emit("updated-message");
			socket.emit("latest-message");
		}
	}, [state]);

	return (
		<div className={styles.container}>
			<form action={formAction}>
				<input
					type="text"
					id="content"
					name="content"
					className={montserrat.className}
					defaultValue={message?.content}
				/>

				<div className={styles.buttons}>
					<button
						className={montserrat.className}
						onClick={(e) => {
							e.preventDefault();
							setEdit(false);
						}}>
						Annuler
					</button>
					<button className={montserrat.className}>modifier</button>
				</div>
			</form>
		</div>
	);
}
