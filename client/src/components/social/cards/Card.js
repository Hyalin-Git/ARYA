"use client";
import Link from "next/link";
import styles from "@/styles/components/social/cards/card.module.css";
import { useContext, useState } from "react";
import Comments from "../Feed/Comments";
import { AuthContext } from "@/context/auth";
import CreateRepost from "../CreateRepost";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Answers from "../Feed/Answers";

export default function Card({
	post,
	comment,
	answer,
	mutatePost,
	mutateComment,
	mutateAnswer,
}) {
	const { uid } = useContext(AuthContext);
	const [repostModal, setRepostModal] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);

	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);

	const isRepost = post?.reposterId;

	return (
		<div className={styles.container}>
			<Link href={`/social/${post._id}`}>
				<article
					className={styles.wrapper}
					data-type={post ? "post" : "comment"}
					id="background">
					<CardHeader
						uid={uid}
						post={post}
						comment={comment}
						answer={answer}
						setIsUpdate={setIsUpdate}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>
					<CardBody
						uid={uid}
						post={post}
						comment={comment}
						answer={answer}
						isRepost={isRepost}
						isUpdate={isUpdate}
						setIsUpdate={setIsUpdate}
						showComments={showComments}
						setShowComments={setShowComments}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>
					<CardFooter
						uid={uid}
						post={post}
						comment={comment}
						answer={answer}
						mutatePost={mutatePost}
						repostModal={repostModal}
						setRepostModal={setRepostModal}
						showComments={showComments}
						setShowComments={setShowComments}
						showAnswers={showAnswers}
						setShowAnswers={setShowAnswers}
						mutateComment={mutateComment}
					/>
					{post && showComments && (
						<Comments
							uid={uid}
							postId={post._id}
							type={isRepost ? "repost" : "post"}
						/>
					)}
					{comment && showAnswers && (
						<Answers uid={uid} commentId={comment._id} />
					)}
				</article>
			</Link>
			{repostModal && (
				<CreateRepost
					uid={uid}
					post={post}
					setRepostModal={setRepostModal}
					mutatePost={mutatePost}
				/>
			)}
		</div>
	);
}
