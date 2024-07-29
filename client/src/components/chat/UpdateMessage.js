import { updateMessage } from "@/actions/message";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/chat/updateMessage.module.css";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import socket from "@/libs/socket";
import Image from "next/image";
const initialState = {
	status: "pending",
	message: "",
	data: {},
	error: [],
};
export default function UpdateMessage({ message, setEdit, uid, otherUserId }) {
	const medias = message?.media;

	const updateMessageAction = updateMessage.bind(null, uid, message._id);
	const [state, formAction] = useFormState(updateMessageAction, initialState);

	useEffect(() => {
		if (state?.status === "success") {
			setEdit(false);

			socket.emit("update-message", state?.data, otherUserId);
			socket.emit("latest-message");
		}
	}, [state]);

	return (
		<div className={styles.container}>
			<form action={formAction}>
				<textarea
					type="text"
					id="content"
					name="content"
					className={montserrat.className}
					defaultValue={message?.content}
				/>
				{medias && (
					<div>
						{message.media.map((img, idx) => {
							return (
								<Image
									className={styles.media}
									src={img}
									alt="media"
									width={0}
									height={0}
									sizes="100vw"
									quality={100}
									key={idx}
								/>
							);
						})}
					</div>
				)}
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
