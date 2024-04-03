"use client";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import Image from "next/image";
import { useContext, useState } from "react";
import Comments from "./Feed/Comments";
import { addReaction, deleteReaction } from "@/actions/post";
import { AuthContext } from "@/context/auth";
import {
	findUidReaction,
	formattedDate,
	hasReacted,
	reactionLength,
} from "@/libs/utils";
export default function Card({ post, comment, answer }) {
	const { uid } = useContext(AuthContext);
	const [moreModal, setMoreModal] = useState(false);
	const [reactionModal, setReactionModal] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const addReactionWithEltId = addReaction.bind(
		null,
		post?._id || comment?._id
	);
	const deleteReactionWithEltId = deleteReaction.bind(
		null,
		post?._id || comment?._id
	);

	const userHasReacted = hasReacted(post.reactions || comment.reactions, uid);
	const getUserReaction = findUidReaction(
		post.reactions || comment.reactions,
		uid
	);

	function handleMoreModal(e) {
		e.preventDefault();
		setMoreModal(!moreModal);
	}

	function handleReaction(e) {
		const reaction = e.currentTarget.getAttribute("data-reaction");
		document.getElementById("reaction").value = reaction;
		document.getElementById("formReaction").requestSubmit();
	}

	function handleDeleteReaction(e) {
		const reaction = e.currentTarget.getAttribute("data-reaction");
		document.getElementById("reaction").value = reaction;
		document.getElementById("formDeleteReaction").requestSubmit();
	}

	const posterImg = post?.posterId.picture;
	const commenterImg = comment?.commenterId.picture;

	return (
		<article className={styles.wrapper} data-type={post ? "post" : "comment"}>
			<div className={styles.header}>
				<div className={styles.user}>
					<Image
						src={
							(posterImg || commenterImg) ?? "/images/profil/default-pfp.jpg"
						}
						alt="profil"
						width={60}
						height={60}
						quality={100}
					/>
					<div>
						<span>
							{post?.posterId?.firstName || comment?.commenterId?.firstName}{" "}
							{post?.posterId?.lastName || comment?.commenterId?.lastName}
						</span>
						<span>
							{post?.posterId?.userName || comment?.commenterId?.userName}
						</span>
						<span>{formattedDate(post || comment)}</span>
					</div>
				</div>
				<div className={styles.more} onClick={handleMoreModal}>
					{moreModal && (
						<div className={styles.list}>
							<ul>
								<li>
									Suivre{" "}
									{post?.posterId?.userName || comment?.commenterId?.userName}
								</li>
								<li>
									Bloquer{" "}
									{post?.posterId?.userName || comment?.commenterId?.userName}
								</li>
								<li>Modifier la publication</li>
								<li>Supprimer la publication</li>
								<li>Signaler la publication</li>
							</ul>
						</div>
					)}
					<div>
						<Image
							src={"/images/icons/ellipsis_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</div>
				</div>
			</div>
			<div className={styles.content}>
				<p>{post?.text || comment?.text}</p>
				<div className={styles.reactions}>
					<ul>
						<li>
							<Image
								src={"/images/icons/love_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<Image
								src={"/images/icons/funny_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<Image
								src={"/images/icons/surprised_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<Image
								src={"/images/icons/sad_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<span>{reactionLength(post || comment)}</span>
						</li>
						<li>
							<Image
								src={"/images/icons/repost_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<span>0</span>
						</li>
						<li
							onClick={(e) => {
								e.preventDefault();
								setShowComments(!showComments);
							}}>
							{post ? post?.commentsLength : comment?.answersLength}{" "}
							Commentaires
						</li>
					</ul>
				</div>
			</div>
			<div className={styles.footer}>
				<div>
					<div
						className={styles.btn}
						onMouseEnter={(e) => {
							e.preventDefault();
							let timeout;
							clearTimeout(timeout);
							timeout = setTimeout(() => {
								setReactionModal(true);
							}, 500);
						}}>
						{reactionModal && (
							<div
								className={styles.reactionModal}
								onMouseLeave={(e) => {
									e.preventDefault();
									let timeout;
									clearTimeout(timeout);
									timeout = setTimeout(() => {
										setReactionModal(false);
									}, 500);
								}}>
								<form action={addReactionWithEltId} id="formReaction">
									<input type="text" id="reaction" name="reaction" hidden />
									<Image
										src={"/images/icons/love_icon.svg"}
										alt="icon"
										width={25}
										height={25}
										data-reaction="love"
										onClick={handleReaction}
									/>
									<Image
										src={"/images/icons/funny_icon.svg"}
										alt="icon"
										width={25}
										height={25}
										data-reaction="funny"
										onClick={handleReaction}
									/>
									<Image
										src={"/images/icons/surprised_icon.svg"}
										alt="icon"
										width={25}
										height={25}
										data-reaction="surprised"
										onClick={handleReaction}
									/>
									<Image
										src={"/images/icons/sad_icon.svg"}
										alt="icon"
										width={25}
										height={25}
										data-reaction="sad"
										onClick={handleReaction}
									/>
								</form>
							</div>
						)}
						{userHasReacted ? (
							<form action={deleteReactionWithEltId} id="formDeleteReaction">
								<input
									type="text"
									id="reaction"
									name="reaction"
									hidden
									value={getUserReaction}
								/>
								<Image
									src={`/images/icons/${getUserReaction}_icon.svg`}
									alt="icon"
									width={25}
									height={25}
									data-reaction={getUserReaction}
									onClick={handleDeleteReaction}
								/>
							</form>
						) : (
							<Image
								src={"/images/icons/addReaction_icon.svg"}
								alt="icon"
								width={25}
								height={25}
							/>
						)}
					</div>
					<div className={styles.btn}>
						<Image
							src={"/images/icons/repost_icon.svg"}
							alt="icon"
							width={25}
							height={25}
						/>
					</div>
					<div
						className={styles.btn}
						onClick={(e) => {
							e.preventDefault();
							setShowComments(!showComments);
						}}>
						<Image
							src={"/images/icons/comment_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</div>
				</div>
				<div className={styles.btn}>
					<Image
						src={"/images/icons/share_icon.svg"}
						alt="icon"
						width={25}
						height={25}
					/>
				</div>
			</div>
			{post && showComments && <Comments postId={post._id} />}
		</article>
	);
}
