"use client";
import { mutate } from "swr";
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
export default function SendCard({ action, type, button, postId }) {
	const [isWriting, setIsWriting] = useState(false);
	const { user } = useContext(AuthContext);
	const text = useRef(null);
	const [state, formAction] = useFormState(action, initialState);
	console.log(state);

	useEffect(() => {
		if (state?.status === "success") {
			text.current.value = "";
			mutate(`api/comments?postId=${postId}`);
		}
	}, [state]);
	return (
		<div className={styles.container} data-type={type}>
			<form action={formAction} id={type === "repost" && "repost"}>
				<div className={styles.form}>
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
					</div>
				</div>
				{(type === "post" || type === "comment") && (
					<div className={styles.footer}>
						<div className={styles.list}>
							<ul>
								<li>
									<input type="file" name="media" id="media" />
									<Image
										src="/images/icons/img_icon.svg"
										width={20}
										height={20}
										alt="icon"
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
										{" "}
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
