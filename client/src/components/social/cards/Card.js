"use client";
import Link from "next/link";
import styles from "@/styles/components/social/cards/card.module.css";
import { useContext, useEffect, useState } from "react";
import Comments from "../Feed/Comments";
import { AuthContext } from "@/context/auth";
import CreateRepost from "../CreateRepost";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Answers from "../Feed/Answers";
import CreateReport from "../CreateReport";
import { useFormState } from "react-dom";
import { saveReportPost } from "@/actions/report";
import PopUp from "@/components/popup/PopUp";

const initialState = {
	status: "",
	message: "",
};

export default function Card({
	element,
	hasParams,
	mutatePost,
	mutateComment,
	mutateAnswer,
}) {
	const { uid } = useContext(AuthContext);

	const saveReportWithUid = saveReportPost.bind(null, uid);
	const [state, formAction] = useFormState(saveReportWithUid, initialState);

	const [repostModal, setRepostModal] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const [reportModal, setReportModal] = useState(false);

	const isPost = element?.posterId;
	const isRepost = element?.reposterId;
	const isComment = element?.commenterId;
	const isAnswer = element?.answererId;

	useEffect(() => {
		setShowComments(hasParams);
		setShowAnswers(hasParams);
		if (state.status === "success") {
			setReportModal(false);
		}
	}, [hasParams, state]);

	console.log(element);

	return (
		<div className={styles.container}>
			<article
				className={styles.wrapper}
				data-type={isPost ? "post" : "comment"}
				id="background">
				{isUpdate ? (
					<>
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
							setReportModal={setReportModal}
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
					</>
				) : (
					<Link
						href={`/social/${element?._id}`}
						className={styles.link}
						data-disabled={isUpdate}
						aria-disabled={isUpdate}>
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
							setReportModal={setReportModal}
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
				)}

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
			{reportModal && (
				<CreateReport
					elementId={element._id}
					setReportModal={setReportModal}
					formAction={formAction}
				/>
			)}
			{state.status === "success" && (
				<PopUp status={"success"} title={"envoyé"} message={state.message} />
			)}
		</div>
	);
}
