"use client";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import Comments from "./Feed/Comments";
export default function Card({ post, comment, answer }) {
	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const postReactions =
		post?.reactions.like.length +
		post?.reactions.love.length +
		post?.reactions.awesome.length +
		post?.reactions.funny.length;
	const commentReactions =
		comment?.reactions.like.length +
		comment?.reactions.love.length +
		comment?.reactions.awesome.length +
		comment?.reactions.funny.length;
	console.log(postReactions);

	const formattedPostDate = moment
		.utc(post?.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
		.locale("fr")
		.fromNow();

	const formattedCommentDate = moment
		.utc(comment?.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
		.locale("fr")
		.fromNow();

	const posterImg = post?.posterId.picture;

	const commenterImg = comment?.commenterId.picture;

	console.log(post);

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
						<span>
							{formattedPostDate === "Invalid date"
								? formattedCommentDate
								: formattedPostDate}
						</span>
					</div>
				</div>

				<div className={styles.more}>
					{" "}
					<Image
						src={"/images/icons/ellipsis_icon.svg"}
						alt="icon"
						width={20}
						height={20}
					/>
				</div>
			</div>
			<div className={styles.content}>
				<p>{post?.text || comment?.text}</p>
				<div className={styles.reactions}>
					<ul>
						<li>
							<Image
								src={"/images/icons/heart_icon.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
							<Image
								src={"/images/icons/laugh_icon.svg"}
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
							<span>{post ? postReactions : commentReactions}</span>
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
					<button>
						<Image
							src={"/images/icons/addReaction_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</button>
					<button>
						<Image
							src={"/images/icons/repost_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</button>
					<button
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
					</button>
				</div>
				<div>
					<button>
						<Image
							src={"/images/icons/share_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</button>
				</div>
			</div>
			{post && showComments && <Comments postId={post._id} />}
		</article>
	);
}
