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
	setIsUpdate,
	mutatePost,
}) {
	const [moreModal, setMoreModal] = useState(false);
	const firstname = getAuthor(post || comment, "firstname");
	const lastname = getAuthor(post || comment, "lastname");
	const username = getAuthor(post || comment, "username");
	const isAuthor = authorCheck(uid, post || comment);
	const posterImg = post?.posterId?.picture;
	const reposterImg = post?.reposterId?.picture;
	const commenterImg = comment?.commenterId?.picture;

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
			mutate(`api/comments?postId=${comment.postId || comment.repostId}`);
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
						(posterImg || reposterImg || commenterImg) ??
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
										<li>
											Suivre{" "}
											{post?.posterId?.userName ||
												comment?.commenterId?.userName}
										</li>
										<li>
											Bloquer{" "}
											{post?.posterId?.userName ||
												comment?.commenterId?.userName}
										</li>
									</>
								)}
								{isAuthor && (
									<>
										<li onClick={handleIsUpdate}>
											Modifier {post && "la publication"}
											{comment && "le commentaire"}
										</li>
										<li onClick={handleDeletePost}>
											Supprimer {post && "la publication"}
											{comment && "le commentaire"}
										</li>
									</>
								)}
								{!isAuthor && (
									<li>
										Signaler {post && "la publication"}
										{comment && "le commentaire"}
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
