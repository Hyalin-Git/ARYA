"use client";
import Image from "next/image";
import styles from "@/styles/components/aryaMedia/sendCard.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormState } from "react-dom";
import moment from "moment";
import GifModal from "./GifModal";
import ScheduleModal from "./ScheduleModal";

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
	const [openSchedule, setOpenSchedule] = useState(false);
	const [openGif, setOpenGif] = useState(false);
	const previewRef = useRef(null);
	const formRef = useRef(null);

	const text = useRef(null);
	const [state, formAction] = useFormState(action, initialState);

	function handleImage(e) {
		const files = e.target.files;
		const preview = previewRef.current;

		if (files) {
			for (const file of files) {
				const img = document.createElement("img");
				preview?.appendChild(img);
				img.src = URL.createObjectURL(file);
			}
			setIsWriting(true);
		}
	}

	useEffect(() => {
		if (state?.status === "success") {
			text.current.value = "";
			const preview = previewRef.current;
			const gifs = document.getElementsByName("gif");

			for (let i = gifs.length - 1; i >= 0; i--) {
				gifs[i].remove();
			}

			while (preview.firstChild) {
				preview.removeChild(preview.firstChild);
			}

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
			if (mutatePost) {
				mutatePost();
			}
		}
	}, [state]);
	console.log(moment().format());
	const formId = (type === "repost" && "repost") || (type === "post" && "post");
	return (
		<div className={styles.container} data-type={type}>
			<form action={formAction} id={formId}>
				<div className={styles.form} ref={formRef}>
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
					<div className={styles.preview} ref={previewRef}></div>
				</div>
				{(type === "post" || type === "comment" || type === "answer") && (
					<div className={styles.footer}>
						<div className={styles.list}>
							<ul>
								<li>
									<label htmlFor={postId || commentId || "media"}>
										<Image
											src="/images/icons/img_icon.svg"
											width={20}
											height={20}
											alt="icon"
											className={styles.icon}
										/>
									</label>
									<input
										onChange={handleImage}
										type="file"
										name="media"
										id={postId || commentId || "media"}
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
										className={styles.icon}
									/>
								</li>
								<li onClick={(e) => setOpenGif(true)}>
									{" "}
									<Image
										src="/images/icons/gif_icon.svg"
										width={20}
										height={20}
										alt="icon"
										className={styles.icon}
									/>
									{openGif && (
										<GifModal
											formRef={formRef}
											previewRef={previewRef}
											setOpenGif={setOpenGif}
											setIsWriting={setIsWriting}
										/>
									)}
								</li>
								{type === "post" && (
									<li>
										<Image
											src="/images/icons/clock_icon.svg"
											width={20}
											height={20}
											alt="icon"
											className={styles.icon}
											onClick={(e) => setOpenSchedule(!openSchedule)}
										/>
										{/* <input
											type="datetime-local"
											name="sendingTime"
											id="sendingTime"
											min={"2024-05-13T13:00"}
										/> */}
										{openSchedule && (
											<ScheduleModal setOpenSchedule={setOpenSchedule} />
										)}
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
