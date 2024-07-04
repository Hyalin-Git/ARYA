"use client";
import styles from "@/styles/layouts/social/aside/conversationPanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function ConversationHeader() {
	const [display, setDisplay] = useState(true);
	return (
		<>
			<div
				className={styles.header}
				id="header"
				onClick={(e) => {
					e.preventDefault();
					setDisplay(!display);
					document
						.getElementById("bodyy")
						.setAttribute("data-display", display);
				}}>
				<span>Messagerie </span>
				{!display ? (
					<FontAwesomeIcon icon={faAngleUp} />
				) : (
					<FontAwesomeIcon icon={faAngleDown} />
				)}
			</div>
		</>
	);
}
