"use client";
import deleteComment from "@/api/comments/comments";
import deletePost from "@/api/posts/post";
import deleteRepost from "@/api/posts/repost";
import { formattedDate, getAuthor, authorCheck } from "@/libs/utils";
import styles from "@/styles/components/social/cards/cardHeader.module.css";
import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";

export default function CardHeader({
	uid,
	post,
	comment,
	answer,
	setIsUpdate,
	mutatePost,
	mutateComment,
}) {
	const [moreModal, setMoreModal] = useState(false);
	const firstname = getAuthor(post || comment || answer, "firstname");
	const lastname = getAuthor(post || comment || answer, "lastname");
	const username = getAuthor(post || comment || answer, "username");
	const isAuthor = authorCheck(uid, post || comment || answer);
	const posterImg = post?.posterId?.picture;
	const reposterImg = post?.reposterId?.picture;
	const commenterImg = comment?.commenterId?.picture;
	const answererImg = answer?.answererId?.picture;

	function handleMoreModal(e) {
		e.preventDefault();
		setMoreModal(!moreModal);
	}

	function handleIsUpdate(e) {
		e.preventDefault();
		setIsUpdate(true);
	}

	async function handleDeletePost(e) {
		e.preventDefault();
		if (post?.reposterId) {
			await deleteRepost(post?._id, uid);
			mutatePost();
			return;
		}
		if (comment) {
			await deleteComment(comment?._id, uid);
			mutateComment();
			return;
		}
		await deletePost(post._id, uid);
		mutatePost();
	}

	return (
		<div className={styles.container}>
			<div className={styles.user}>
				<Image
					src={
						(posterImg || reposterImg || commenterImg || answererImg) ??
						"/images/profil/default-pfp.jpg"
					}
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
					<span>{formattedDate(post || comment)}</span>
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
											Modifier {post && "la publication"}
											{comment && "le commentaire"}
											{answer && "La réponse"}
										</li>
										<li onClick={handleDeletePost}>
											Supprimer {post && "la publication"}
											{comment && "le commentaire"}
											{answer && "La réponse"}
										</li>
									</>
								)}
								{!isAuthor && (
									<li>
										Signaler {post && "la publication"}
										{comment && "le commentaire"} {answer && "La réponse"}
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
