"use client";
import styles from "@/styles/components/aryaMedia/comments.module.css";
import Card from "../cards/Card";
import SendCard from "../SendCard";
import useSWR from "swr";
import saveAnswer from "@/actions/answer";
import getAnswers from "@/api/answers/answers";

export default function Answers({ uid, commentId }) {
	const saveAnswerWithId = saveAnswer.bind(null, uid);
	const fetchAnswers = getAnswers.bind(null, commentId);
	const { data, mutate, error, isLoading } = useSWR(
		`/api/answers?commentId=${commentId}`,
		fetchAnswers,
		{
			keepPreviousData: true,
		}
	);

	return (
		<div className={styles.container}>
			<SendCard
				action={saveAnswerWithId}
				type={"answer"}
				button={"Répondre"}
				commentId={commentId}
				mutateAnswer={mutate}
			/>
			{isLoading ? (
				<div className={styles.loading}>loading</div>
			) : (
				<>
					{data?.length > 0 &&
						data?.map((answer) => {
							return (
								<Card element={answer} key={answer._id} mutateAnswer={mutate} />
							);
						})}
				</>
			)}
		</div>
	);
}
