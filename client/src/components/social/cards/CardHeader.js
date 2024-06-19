"use client";
import deleteComment from "@/api/comments/comments";
import { deletePost } from "@/api/posts/post";
import deleteRepost from "@/api/posts/repost";
import { blockUser } from "@/api/user/user";
import { formattedDate, getAuthor, authorCheck } from "@/libs/utils";
import styles from "@/styles/components/social/cards/cardHeader.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CardHeader({
	uid,
	element,
	type,
	setIsUpdate,
	mutatePost,
	mutateComment,
	setReportModal,
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

	function handleMoreModal(e) {
		e.preventDefault();
		setMoreModal(!moreModal);
	}

	function handleIsUpdate(e) {
		e.preventDefault();
		setIsUpdate(true);
	}

	async function handleBlockUser(e) {
		e.preventDefault();
		const uidToBlock =
			element?.posterId?._id ||
			element?.reposterId?._id ||
			element?.commenterId?._id ||
			element?.answererId?._id;

		await blockUser(uid, uidToBlock);
	}

	async function handleDeleteElt(e) {
		e.preventDefault();
		if (type === "repost") {
			await deleteRepost(element?._id, uid);
			if (mutatePost) {
				mutatePost();
			}
			return;
		}
		if (type === "comment") {
			await deleteComment(element?._id, uid);
			mutateComment();
			return;
		}
		if (type === "post") {
			await deletePost(element?._id, uid);
			if (mutatePost) {
				mutatePost();
			}
		}
	}

	return (
		<div className={styles.container}>
			<Link href={`/user/${username}/posts`}>
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
			</Link>
			<div className={styles.more} onClick={handleMoreModal}>
				{moreModal && (
					<>
						<div className={styles.modal}>
							<ul>
								{!isAuthor && (
									<>
										<li>Suivre {username}</li>
										<li onClick={handleBlockUser}>Bloquer {username}</li>
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
									<li onClick={(e) => setReportModal(true)}>
										Signaler{" "}
										{(type === "post" || type === "repost") && "la publication"}
										{type === "comment" && "le commentaire"}
										{type === "answer" && "La réponse"}
									</li>
								)}
							</ul>
						</div>
						<div id="hiddenOverlay"></div>
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
