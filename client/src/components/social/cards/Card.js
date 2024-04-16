"use client";
import styles from "@/styles/components/aryaMedia/feed.module.css";
import { useContext, useState } from "react";
import Comments from "../Feed/Comments";
import { AuthContext } from "@/context/auth";
import CreateRepost from "../CreateRepost";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";

export default function Card({ post, comment, answer, mutatePost }) {
	const { uid } = useContext(AuthContext);
	const [repostModal, setRepostModal] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);

	const [showComments, setShowComments] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);

	const isRepost = post?.reposterId;

	return (
		<div className={styles.container}>
			<article
				className={styles.wrapper}
				data-type={post ? "post" : "comment"}
				id="background">
				<CardHeader
					uid={uid}
					post={post}
					comment={comment}
					setIsUpdate={setIsUpdate}
					mutatePost={mutatePost}
				/>
				<CardBody
					uid={uid}
					post={post}
					comment={comment}
					isRepost={isRepost}
					isUpdate={isUpdate}
					setIsUpdate={setIsUpdate}
					showComments={showComments}
					setShowComments={setShowComments}
					mutatePost={mutatePost}
				/>
				<CardFooter
					uid={uid}
					post={post}
					comment={comment}
					mutatePost={mutatePost}
				/>
				{post && showComments && (
					<Comments postId={post._id} type={isRepost ? "repost" : "post"} />
				)}
			</article>
			{repostModal && (
				<CreateRepost post={post} setRepostModal={setRepostModal} />
			)}
		</div>
	);
}
