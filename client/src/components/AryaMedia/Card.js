"use client";
import { mutate } from "swr";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Comments from "./Feed/Comments";
import { AuthContext } from "@/context/auth";
import {
	findUidReaction,
	formattedDate,
	hasReacted,
	reactionLength,
} from "@/libs/utils";
import deletePost, { addReaction, deleteReaction } from "@/api/posts/post";
import UpdateCard from "./UpdateCard";
import deleteRepost, {
	addRepostReaction,
	deleteRepostReaction,
} from "@/api/posts/repost";
import deleteComment, {
	addCommentReaction,
	deleteCommentReaction,
} from "@/api/comments/comments";
import { updatePost } from "@/actions/post";
import { updateComment } from "@/actions/comment";
export default function Card({ post, comment, answer }) {
	const { uid } = useContext(AuthContext);
	const [isUpdate, setIsUpdate] = useState(false);
	const [moreModal, setMoreModal] = useState(false);
	const [reactionModal, setReactionModal] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const updatePostWithId = updatePost.bind(null, post?._id, uid);
	const updateCommentWithId = updateComment.bind(null, comment?._id, uid);
	const userHasReacted = hasReacted(post?.reactions || comment?.reactions, uid);
	const getUserReaction = findUidReaction(
		post?.reactions || comment?.reactions,
		uid
	);

	const isAuthor =
		uid === post?.posterId?._id ||
		post?.reposterId?._id ||
		comment?.commenterId._id;

	function handleMoreModal(e) {
		e.preventDefault();
		setMoreModal(!moreModal);
	}

	function handleIsUpdate(e) {
		e.preventDefault();
		setIsUpdate(!isUpdate);
	}

	async function handleReaction(e, reaction) {
		e.preventDefault();
		if (post?.reposterId) {
			await addRepostReaction(post?._id, uid, reaction);
			return;
		}
		if (comment) {
			await addCommentReaction(comment?._id, uid, reaction);
			mutate(`api/comments?postId=${comment.postId}`);
			return;
		}
		await addReaction(post?._id, uid, reaction);
	}

	async function handleDeleteReaction(e) {
		e.preventDefault();
		if (post?.reposterId) {
			await deleteRepostReaction(post?._id, uid);
			return;
		}
		if (comment) {
			await deleteCommentReaction(comment?._id, uid);
			mutate(`api/comments?postId=${comment.postId}`);
			return;
		}
		await deleteReaction(post?._id, uid);
	}

	async function handleDeletePost(e) {
		e.preventDefault();
		if (post?.reposterId) {
			await deleteRepost(post?._id, uid);
			return;
		}
		if (comment) {
			await deleteComment(comment?._id, uid);
			mutate(`api/comments?postId=${comment.postId}`);
			return;
		}
		await deletePost(post._id, uid);
	}

	const isRepost = post?.reposterId;

	const firstName =
		post?.posterId?.firstName ||
		post?.reposterId.firstName ||
		comment?.commenterId?.firstName;
	const lastName =
		post?.posterId?.lastName ||
		post?.reposterId.lastName ||
		comment?.commenterId?.lastName;
	const userName =
		post?.posterId?.userName ||
		post?.reposterId.userName ||
		comment?.commenterId?.userName;

	const posterImg = post?.posterId?.picture;
	const reposterImg = post?.reposterId?.picture;
	const commenterImg = comment?.commenterId?.picture;

	return (
		<article className={styles.wrapper} data-type={post ? "post" : "comment"}>
			<div className={styles.header}>
				<div className={styles.user}>
					<Image
						src={
							(posterImg || reposterImg || commenterImg) ??
							"/images/profil/default-pfp.jpg"
						}
						alt="profil"
						width={60}
						height={60}
						quality={100}
					/>
					<div>
						<span>
							{firstName} {lastName}
						</span>
						<span>{userName}</span>
						<span>{formattedDate(post || comment)}</span>
					</div>
				</div>
				<div className={styles.more} onClick={handleMoreModal}>
					{moreModal && (
						<>
							<div className={styles.list}>
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
						/>
					</div>
				</div>
			</div>
			<div className={styles.content}>
				<div>
					{isUpdate ? (
						<UpdateCard
							element={post ? post : comment}
							action={post ? updatePostWithId : updateCommentWithId}
							setIsUpdate={setIsUpdate}
						/>
					) : (
						<p>{post?.text || comment?.text}</p>
					)}
				</div>
				{isRepost && (
					<div className={styles.repost}>
						<div className={styles.header}>
							<div className={styles.user}>
								<Image
									src={
										post?.postId.posterId.picture ??
										"/images/profil/default-pfp.jpg"
									}
									alt="profil"
									width={60}
									height={60}
									quality={100}
								/>
								<div>
									<span>
										{post?.postId.posterId.firstName}{" "}
										{post?.postId.posterId.lastName}
									</span>
									<span>{post?.postId.posterId.userName}</span>
									<span>{formattedDate(post || comment)}</span>
								</div>
							</div>
						</div>
						<div className={styles.content}>
							<div>
								<p>{post?.postId.text}</p>
							</div>
						</div>
					</div>
				)}
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
							{post && "Commentaires"}
							{comment && "Réponses"}
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
						}}
						onMouseLeave={(e) => {
							e.preventDefault();
							let timeout;
							clearTimeout(timeout);
							timeout = setTimeout(() => {
								setReactionModal(false);
							}, 500);
						}}>
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
