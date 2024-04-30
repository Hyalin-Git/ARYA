"use client";
import deleteComment from "@/api/comments/comments";
import { deletePost } from "@/api/posts/post";
import deleteRepost from "@/api/posts/repost";
import { formattedDate, getAuthor, authorCheck } from "@/libs/utils";
import styles from "@/styles/components/social/cards/cardHeader.module.css";
import Image from "next/image";
import { useState } from "react";

export default function CardHeader({
	uid,
	element,
	type,
	setIsUpdate,
	mutatePost,
	mutateComment,
}) {
	const [moreModal, setMoreModal] = useState(false);
	const firstname = getAuthor(element, "firstname");
	const lastname = getAuthor(element, "lastname");
	const username = getAuthor(element, "username");
	const isAuthor = authorCheck(uid, element);
	const posterImg = element?.posterId?.picture;
	const reposterImg = element?.reposterId?.picture;
	const commenterImg = element?.commenterId?.picture;
	const answererImg = element?.answererId?.picture;
	const picture = posterImg || reposterImg || commenterImg || answererImg;
	console.log("type of element:", type);

	function handleMoreModal(e) {
		e.preventDefault();
		setMoreModal(!moreModal);
	}

	function handleIsUpdate(e) {
		e.preventDefault();
		setIsUpdate(true);
	}

	async function handleDeleteElt(e) {
		e.preventDefault();
		if (type === "repost") {
			await deleteRepost(element?._id, uid);
			mutatePost();
			return;
		}
		if (type === "comment") {
			await deleteComment(element?._id, uid);
			mutateComment();
			return;
		}
		if (type === "post") {
			await deletePost(element?._id, uid);
			mutatePost();
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.user}>
				<Image
					src={picture ?? "/images/profil/default-pfp.jpg"}
					alt="profil"
					width={50}
					height={50}
					quality={100}
				/>
				<div>
					<span>
						{firstname} {lastname}
					</span>
					<span>{username}</span>
					<span>{formattedDate(element)}</span>
				</div>
			</div>
			<div className={styles.more} onClick={handleMoreModal}>
				{moreModal && (
					<>
						<div className={styles.modal}>
							<ul>
								{!isAuthor && (
									<>
										<li>Suivre {username}</li>
										<li>Bloquer {username}</li>
									</>
								)}
								{isAuthor && (
									<>
										<li onClick={handleIsUpdate}>
											Modifier{" "}
											{(type === "post" || type === "repost") &&
												"la publication"}
											{type === "comment" && "le commentaire"}
											{type === "answer" && "La réponse"}
										</li>
										<li onClick={handleDeleteElt}>
											Supprimer{" "}
											{(type === "post" || type === "repost") &&
												"la publication"}
											{type === "comment" && "le commentaire"}
											{type === "answer" && "La réponse"}
										</li>
									</>
								)}
								{!isAuthor && (
									<li>
										Signaler{" "}
										{(type === "post" || type === "repost") && "la publication"}
										{type === "comment" && "le commentaire"}
										{type === "answer" && "La réponse"}
									</li>
								)}
							</ul>
						</div>
						<div id="overlay"></div>
					</>
				)}
				<div>
					<Image
						src={"/images/icons/ellipsis_icon.svg"}
						alt="icon"
						width={20}
						height={20}
						id="icon"
					/>
				</div>
			</div>
		</div>
	);
}
