"use client";
import {
	addCommentReaction,
	deleteCommentReaction,
} from "@/api/comments/comments";
import { addReaction, deleteReaction } from "@/api/posts/post";
import { addRepostReaction, deleteRepostReaction } from "@/api/posts/repost";
import { findUidReaction, hasReacted } from "@/libs/utils";
import styles from "@/styles/components/social/cards/cardFooter.module.css";
import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";

export default function CardFooter({
	uid,
	post,
	comment,
	mutatePost,
	repostModal,
	setRepostModal,
	showComments,
	setShowComments,
}) {
	const [reactionModal, setReactionModal] = useState(false);
	const userHasReacted = hasReacted(post?.reactions || comment?.reactions, uid);
	const getUserReaction = findUidReaction(
		post?.reactions || comment?.reactions,
		uid
	);
	function handleMouseEnter(e) {
		e.preventDefault();
		let timeout;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setReactionModal(true);
		}, 500);
	}
	function handleMouseLeave(e) {
		e.preventDefault();
		let timeout;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setReactionModal(false);
		}, 500);
	}

	async function handleReaction(e, reaction) {
		e.preventDefault();
		if (post?.reposterId) {
			await addRepostReaction(post?._id, uid, reaction);
			mutatePost();
			return;
		}
		if (comment) {
			await addCommentReaction(comment?._id, uid, reaction);
			mutate(`api/comments?postId=${comment.postId || comment.repostId}`);
			return;
		}
		await addReaction(post?._id, uid, reaction);
		mutatePost();
	}

	async function handleDeleteReaction(e) {
		e.preventDefault();
		if (post?.reposterId) {
			await deleteRepostReaction(post?._id, uid);
			mutatePost();
			return;
		}
		if (comment) {
			await deleteCommentReaction(comment?._id, uid);
			mutate(`api/comments?postId=${comment.postId || comment.repostId}`);
			return;
		}
		await deleteReaction(post?._id, uid);
		mutatePost();
	}

	return (
		<div className={styles.container}>
			<div>
				<div
					className={styles.btn}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					{reactionModal && (
						<div className={styles.reactionModal}>
							<Image
								src={"/images/icons/love_icon.svg"}
								alt="icon"
								width={25}
								height={25}
								onClick={(e) => {
									handleReaction(e, "love");
								}}
							/>
							<Image
								src={"/images/icons/funny_icon.svg"}
								alt="icon"
								width={25}
								height={25}
								onClick={(e) => {
									handleReaction(e, "funny");
								}}
							/>
							<Image
								src={"/images/icons/surprised_icon.svg"}
								alt="icon"
								width={25}
								height={25}
								onClick={(e) => {
									handleReaction(e, "surprised");
								}}
							/>
							<Image
								src={"/images/icons/sad_icon.svg"}
								alt="icon"
								width={25}
								height={25}
								onClick={(e) => {
									handleReaction(e, "sad");
								}}
							/>
						</div>
					)}
					{userHasReacted ? (
						<Image
							src={`/images/icons/${getUserReaction}_icon.svg`}
							alt="icon"
							width={25}
							height={25}
							onClick={handleDeleteReaction}
						/>
					) : (
						<Image
							src={"/images/icons/addReaction_icon.svg"}
							alt="icon"
							width={25}
							height={25}
							id="icon"
						/>
					)}
				</div>
				<div
					className={styles.btn}
					onClick={(e) => setRepostModal(!repostModal)}>
					<Image
						src={"/images/icons/repost_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						id="icon"
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
						id="icon"
					/>
				</div>
			</div>
			<div className={styles.btn}>
				<Image
					src={"/images/icons/share_icon.svg"}
					alt="icon"
					width={25}
					height={25}
					id="icon"
				/>
			</div>
		</div>
	);
}
