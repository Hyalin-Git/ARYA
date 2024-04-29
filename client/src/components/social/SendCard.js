"use client";
import Image from "next/image";
import styles from "@/styles/components/aryaMedia/sendCard.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
};
export default function SendCard({
	action,
	type,
	button,
	postId,
	commentId,
	setRepostModal,
	mutatePost,
	mutateComment,
	mutateAnswer,
}) {
	const [isWriting, setIsWriting] = useState(false);
	const { user } = useContext(AuthContext);
	const text = useRef(null);
	const [state, formAction] = useFormState(action, initialState);

	function handleImage(e) {
		e.preventDefault();
		const files = e.target.files;

		const preview = document.querySelectorAll(`[data-type="${type}"]`)[1];
		if (files) {
			for (const file of files) {
				const img = document.createElement("img");
				preview.appendChild(img);
				img.src = URL.createObjectURL(file);
			}
			setIsWriting(true);
		}
	}

	useEffect(() => {
		if (state?.status === "success") {
			text.current.value = "";
			if (type === "repost") {
				setRepostModal(false);
			}
			if (type === "comment") {
				mutateComment();
				return;
			}
			if (type === "answer") {
				mutateAnswer();
				return;
			}
			mutatePost();
		}
	}, [state]);
	return (
		<div className={styles.container} data-type={type}>
			<form action={formAction} id={type === "repost" ? "repost" : ""}>
				<div className={styles.form}>
					<div className={styles.top}>
						<div>
							<Image
								src={
									user.picture ? user.picture : "/images/profil/default-pfp.jpg"
								}
								alt="profil"
								width={50}
								height={50}
								quality={100}
							/>
						</div>
						<div className={styles.text}>
							<textarea
								ref={text}
								onChange={(e) => {
									e.preventDefault();
									if (e.target.value.length > 0) {
										setIsWriting(true);
									} else {
										setIsWriting(false);
									}
									e.target.style.height = "";
									e.target.style.height = e.target.scrollHeight + "px";
								}}
								name="text"
								id="text"
								type="text"
								placeholder={
									type === "post"
										? `Quelque chose à partager aujourd'hui ${user?.userName} ?`
										: "Ajouter un commentaire"
								}
								className={montserrat.className}
							/>
							{type === "repost" && (
								<input
									type="text"
									name="postId"
									id="postId"
									defaultValue={postId}
									hidden
								/>
							)}
							{type === "answer" && (
								<input
									type="text"
									name="commentId"
									id="commentId"
									defaultValue={commentId}
									hidden
								/>
							)}
						</div>
					</div>
					<div className={styles.preview} data-type={type}></div>
				</div>
				{(type === "post" || type === "comment" || type === "answer") && (
					<div className={styles.footer}>
						<div className={styles.list}>
							<ul>
								<li>
									<label htmlFor="media">
										<Image
											src="/images/icons/img_icon.svg"
											width={20}
											height={20}
											alt="icon"
										/>
									</label>
									<input
										onChange={handleImage}
										type="file"
										name="media"
										id="media"
										multiple
										hidden
										max={4}
									/>
								</li>
								<li>
									{" "}
									<Image
										src="/images/icons/video_icon.svg"
										width={20}
										height={20}
										alt="icon"
									/>
								</li>
								<li>
									{" "}
									<Image
										src="/images/icons/gif_icon.svg"
										width={20}
										height={20}
										alt="icon"
									/>
								</li>
								{type === "post" && (
									<li>
										<Image
											src="/images/icons/clock_icon.svg"
											width={20}
											height={20}
											alt="icon"
										/>
									</li>
								)}
							</ul>
						</div>
						{isWriting && (
							<div className={styles.button}>
								<button type="submit" className={clsx(montserrat.className)}>
									{button}
								</button>
							</div>
						)}
					</div>
				)}
			</form>
		</div>
	);
}
