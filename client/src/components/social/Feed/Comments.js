"use client";
import styles from "@/styles/components/aryaMedia/comments.module.css";
import { getComments } from "@/api/comments/comments";
import Card from "../cards/Card";
import SendCard from "../SendCard";
import { saveComment } from "@/actions/comment";
import useSWR from "swr";

export default function Comments({ postId, type }) {
	const saveCommentWithId = saveComment.bind(null, postId, type);
	const fetchComments = getComments.bind(null, postId, type);
	const { data, error, isLoading } = useSWR(
		`api/comments?postId=${postId}`,
		fetchComments
	);
	return (
		<div className={styles.container}>
			<SendCard
				action={saveCommentWithId}
				type={"comment"}
				button={"Commenter"}
				postId={postId}
			/>
			{isLoading ? (
				<div className={styles.loading}>loading</div>
			) : (
				<>
					{data?.length > 0 &&
						data?.map((comment) => {
							return <Card comment={comment} key={comment._id} />;
						})}
				</>
			)}
		</div>
	);
}
