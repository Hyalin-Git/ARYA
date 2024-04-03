"use client";
import styles from "@/styles/components/aryaMedia/comments.module.css";
import { getComments } from "@/api/comments/comments";
import { useEffect, useState } from "react";
import Card from "../Card";
import SendCard from "../SendCard";
import { saveComment } from "@/actions/comment";

export default function Comments({ postId }) {
	const [comments, setComments] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const saveCommentWithId = saveComment.bind(null, postId);
	useEffect(() => {
		async function fetchComments() {
			const fetchedComments = await getComments(postId);
			setComments(fetchedComments);
			setLoading(false);
		}
		fetchComments();
	}, [postId]);

	return (
		<div className={styles.container}>
			<SendCard
				action={saveCommentWithId}
				type={"comment"}
				button={"Commenter"}
			/>
			{isLoading ? (
				<div className={styles.loading}>loading</div>
			) : (
				<>
					{comments.length > 0 &&
						comments?.map((comment) => {
							return <Card comment={comment} key={comment._id} />;
						})}
				</>
			)}
		</div>
	);
}
