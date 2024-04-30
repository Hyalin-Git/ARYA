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
	element,
	mutatePost,
	mutateComment,
	mutateAnswer,
}) {
	const { uid } = useContext(AuthContext);
	const [repostModal, setRepostModal] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);

	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);

	const isPost = element?.posterId;
	const isRepost = element?.reposterId;
	const isComment = element?.commenterId;
	const isAnswer = element?.answererId;

	return (
		<div className={styles.container}>
			<article
				className={styles.wrapper}
				data-type={isPost ? "post" : "comment"}
				id="background">
				<Link href={`/social/${element?._id}`}>
					<CardHeader
						uid={uid}
						element={element}
						type={
							(isPost && "post") ||
							(isRepost && "repost") ||
							(isComment && "comment") ||
							(isAnswer && "answer")
						}
						setIsUpdate={setIsUpdate}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>
					<CardBody
						uid={uid}
						element={element}
						type={
							(isPost && "post") ||
							(isRepost && "repost") ||
							(isComment && "comment") ||
							(isAnswer && "answer")
						}
						isUpdate={isUpdate}
						setIsUpdate={setIsUpdate}
						showComments={showComments}
						setShowComments={setShowComments}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>

					<CardFooter
						uid={uid}
						element={element}
						type={
							(isPost && "post") ||
							(isRepost && "repost") ||
							(isComment && "comment") ||
							(isAnswer && "answer")
						}
						mutatePost={mutatePost}
						repostModal={repostModal}
						setRepostModal={setRepostModal}
						showComments={showComments}
						setShowComments={setShowComments}
						showAnswers={showAnswers}
						setShowAnswers={setShowAnswers}
						mutateComment={mutateComment}
					/>
				</Link>
				{(isPost || isRepost) && showComments && (
					<Comments
						uid={uid}
						postId={element._id}
						type={(isPost && "post") || (isRepost && "repost")}
					/>
				)}
				{isComment && showAnswers && (
					<Answers uid={uid} commentId={element._id} />
				)}
			</article>
			{repostModal && (
				<CreateRepost
					uid={uid}
					element={element}
					setRepostModal={setRepostModal}
					mutatePost={mutatePost}
				/>
			)}
		</div>
	);
}
