"use client";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import Comments from "./Comments";
export default function Feed({ post, children }) {
	const [showComments, setShowComment] = useState(false);
	const reactions =
		post.reactions.like.length +
		post.reactions.love.length +
		post.reactions.awesome.length +
		post.reactions.funny.length;

	const formattedDate = moment
		.utc(post.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
		.locale("fr")
		.fromNow();

	return (
		<article className={styles.wrapper}>
			<div className={styles.header}>
				<div className={styles.user}>
					<Image
						src={
							post.posterId.picture
								? post.posterId.picture
								: "/images/profil/default-pfp.jpg"
						}
						alt="profil"
						width={60}
						height={60}
						quality={100}
					/>
					<div>
						<span>
							{post.posterId.firstName} {post.posterId.lastName}
						</span>
						<span>{post.posterId.userName}</span>
						<span>{formattedDate}</span>
					</div>
				</div>

				<div>
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
				<p>{post.text}</p>
				<div className={styles.reactions}>
					<ul>
						<li>{reactions}</li>
						<li>{post.commentsLength}</li>
						<li
							onClick={(e) => {
								e.preventDefault();
								setShowComment(!showComments);
							}}>
							{post.commentsLength} Commentaires
						</li>
					</ul>
				</div>
			</div>
			<div className={styles.footer}>
				<div>
					<button>Réagir</button>
					<button>Reposter</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setShowComment(!showComments);
						}}>
						Commenter
					</button>
				</div>
				<button>Partager</button>
			</div>
			{showComments && <Comments postId={post._id} />}
		</article>
	);
}
