import { updateMessage } from "@/actions/message";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/chat/updateMessage.module.css";
import { useFormState } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import socket from "@/libs/socket";
import Image from "next/image";
const initialState = {
	status: "pending",
	message: "",
	data: {},
	error: [],
};
export default function UpdateMessage({ message, setEdit, uid, otherUserId }) {
	const formRef = useRef(null);
	const inputRef = useRef(null);
	const medias = message?.media;

	const updateMessageAction = updateMessage.bind(null, uid, message._id);
	const [state, formAction] = useFormState(updateMessageAction, initialState);

	// Handle auto resize for the textarea
	function handleAutoResize(e) {
		e.preventDefault();
		e.target.style.height = "";
		e.target.style.height = e.target.scrollHeight + "px";
		if (e.target.scrollHeight > 200) {
			e.target.style.overflowY = "scroll";
		} else {
			e.target.style.overflow = "hidden";
		}
	}

	// Handle return to line
	function returnToLine(e) {
		if (e.key === "Enter" && e.shiftKey) {
			return;
		} else if (e.key === "Enter") {
			e.preventDefault();
		}
	}

	function cancelEdit(e) {
		e.preventDefault();
		setEdit(false);
	}

	useEffect(() => {
		// If post res return a success
		if (state?.status === "success") {
			setEdit(false); // cancel the edition

			// emit to socket and pass the message as param
			socket.emit("update-message", state?.data, otherUserId);
			socket.emit("latest-message");
		}
	}, [state]);

	useEffect(() => {
		// Textarea auto size based on the default value
		inputRef.current.style.height = inputRef.current.scrollHeight + "px";
	}, [inputRef]);

	useEffect(() => {
		// Listening if the user press escape or enter
		window.addEventListener("keydown", (e) => {
			// if espace is pressed quit the msg edition
			if (e.key === "Escape") {
				e.preventDefault();
				setEdit(false);
			}
			// if enter and shift key are pressed at the same time nothing happen
			if (e.key === "Enter" && e.shiftKey) {
				return;
			} else if (e.key === "Enter") {
				// If enter alone is pressed then sending the form
				formRef?.current?.requestSubmit();
			}
		});
	}, [formRef]);

	return (
		<div className={styles.container}>
			<form action={formAction} ref={formRef}>
				<textarea
					ref={inputRef}
					type="text"
					id="content"
					name="content"
					rows={1}
					className={montserrat.className}
					defaultValue={message?.content}
					onChange={handleAutoResize}
					onKeyDown={returnToLine}></textarea>

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
					<p>
						échap pour{" "}
						<button className={montserrat.className} onClick={cancelEdit}>
							annuler
						</button>{" "}
						entrer pour{" "}
						<button className={montserrat.className}>modifier</button>
					</p>
				</div>
			</form>
		</div>
	);
}
