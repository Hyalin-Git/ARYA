"use client";
import styles from "@/styles/components/social/comments/comments.module.css";
import { getComments } from "@/api/comments/comments";
import Card from "../cards/Card";
import SendCard from "../cards/SendCard";
import { saveComment } from "@/actions/comment";
import useSWR from "swr";

export default function Comments({ uid, postId, type }) {
	const saveCommentWithId = saveComment.bind(null, uid, postId, type);
	const fetchComments = getComments.bind(null, postId, type);
	const { data, mutate, error, isLoading } = useSWR(
		`api/comments?postId=${postId}`,
		fetchComments,
		{
			keepPreviousData: true,
		}
	);
	return (
		<div className={styles.container}>
			<SendCard
				action={saveCommentWithId}
				type={"comment"}
				button={"Commenter"}
				postId={postId}
				mutateComment={mutate}
			/>
			{isLoading ? (
				<div className={styles.loading}>loading</div>
			) : (
				<>
					{data?.length > 0 &&
						data?.map((comment) => {
							return (
								<Card
									element={comment}
									key={comment._id}
									mutateComment={mutate}
								/>
							);
						})}
				</>
			)}
		</div>
	);
}
