"use client";
import useSWR from "swr";
import styles from "@/styles/components/aryaMedia/comments.module.css";
import { getComments } from "@/api/comments/comments";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import Image from "next/image";
import clsx from "clsx";
import Card from "../Card";

export default function Comments({ postId }) {
	const { user } = useContext(AuthContext);
	const [comments, setComments] = useState(null);
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchComments() {
			const fetchedComments = await getComments(postId);
			setComments(fetchedComments);
			setLoading(false);
		}
		fetchComments();

		return;
	}, [postId]);

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<form className={styles.form}>
					<div>
						<div className={styles.picture}>
							<Image
								src={
									user.picture ? user.picture : "/images/profil/default-pfp.jpg"
								}
								alt="profil"
								width={60}
								height={60}
								quality={100}
							/>
						</div>
						<div className={styles.text}>
							<textarea
								onChange={(e) => {
									e.preventDefault();
									if (e.target.value.length <= 0) {
										document
											.getElementById("btn")
											.setAttribute("data-writing", false);
									} else {
										document
											.getElementById("btn")
											.setAttribute("data-writing", true);
									}
								}}
								name="text"
								id="text"
								type="text"
								placeholder={`Ajouter un commentaire`}
								className={montserrat.className}
							/>
						</div>
					</div>
					<div className={styles.footer}>
						<div>
							<ul>
								<li>
									<Image
										src="/images/icons/img_icon.svg"
										width={25}
										height={25}
										alt="icon"
									/>
								</li>
								<li>
									{" "}
									<Image
										src="/images/icons/video_icon.svg"
										width={25}
										height={25}
										alt="icon"
									/>
								</li>
								<li>
									{" "}
									<Image
										src="/images/icons/gif_icon.svg"
										width={25}
										height={25}
										alt="icon"
									/>
								</li>
							</ul>
						</div>
						<div className={styles.button}>
							<button
								data-writing={false}
								type="submit"
								className={clsx(montserrat.className)}
								id="btn">
								Commenter
							</button>
						</div>
					</div>
				</form>
			</div>
			{isLoading ? (
				<div className={styles.loading}>loading</div>
			) : (
				<>
					{comments.length > 0 &&
						comments?.map((comment) => {
							return <Card comment={comment} key={comment._id} />;
						})}
				</>
			)}
		</div>
	);
}
