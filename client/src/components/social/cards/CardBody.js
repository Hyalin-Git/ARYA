import styles from "@/styles/components/social/cards/cardBody.module.css";
import Image from "next/image";
import UpdateCard from "./UpdateCard";
import { formattedDate, reactionLength } from "@/libs/utils";
import { updatePost } from "@/actions/post";
import { updateRepost } from "@/actions/repost";
import { updateComment } from "@/actions/comment";

export default function CardBody({
	uid,
	post,
	comment,
	answer,
	isRepost,
	isUpdate,
	setIsUpdate,
	showComments,
	setShowComments,
	mutatePost,
	mutateComment,
}) {
	const updatePostWithId = updatePost.bind(null, post?._id, uid);
	const updateRepostWithId = updateRepost.bind(null, post?._id, uid);
	const updateCommentWithId = updateComment.bind(null, comment?._id, uid);
	// const updateCommentWithId = updateComment.bind(null, comment?._id, uid);
	const reactLength = reactionLength(post || comment || answer);
	return (
		<div className={styles.container}>
			<div>
				{isUpdate ? (
					<UpdateCard
						element={post ? post : comment}
						type={post ? "post" : "comment"}
						action={
							isRepost
								? updateRepostWithId
								: (post && updatePostWithId) || (comment && updateCommentWithId)
						}
						setIsUpdate={setIsUpdate}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>
				) : (
					<p>{post?.text || comment?.text || answer?.text}</p>
				)}
			</div>
			<div className={styles.media}>
				{post ? (
					<>
						{post?.media?.map((img, idx) => {
							return (
								<Image
									src={img}
									alt="media"
									width={0}
									height={0}
									sizes="100vw"
									quality={100}
									key={idx}
								/>
							);
						})}
					</>
				) : (
					<>
						{comment?.media?.map((img, idx) => {
							return (
								<Image
									src={img}
									alt="media"
									width={0}
									height={0}
									sizes="100vw"
									quality={100}
									key={idx}
								/>
							);
						})}
					</>
				)}
			</div>
			{isRepost && (
				<div className={styles.repost}>
					{!post?.postId?.text && !post?.postId?.media ? (
						<div>
							<p>Publication supprimé</p>
						</div>
					) : (
						<>
							<div className={styles.header}>
								<div className={styles.user}>
									<Image
										src={
											post?.postId?.posterId?.picture ??
											"/images/profil/default-pfp.jpg"
										}
										alt="profil"
										width={40}
										height={40}
										quality={100}
									/>
									<div>
										<span>
											{post?.postId?.posterId?.firstName}{" "}
											{post?.postId?.posterId?.lastName}
										</span>
										<span>{post?.postId?.posterId?.userName}</span>
										<span>{formattedDate(post?.postId || comment)}</span>
									</div>
								</div>
							</div>
							<div className={styles.content}>
								<div>
									<p>{post?.postId?.text}</p>
								</div>
								<div className={styles.media}>
									{post?.postId?.media?.map((img) => {
										return (
											<Image
												src={img}
												alt="media"
												width={0}
												height={0}
												sizes="100vw"
												quality={100}
											/>
										);
									})}
								</div>
							</div>
						</>
					)}
				</div>
			)}
			<div className={styles.reactions}>
				<ul>
					<li>
						<Image
							src={"/images/icons/love_icon.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
						<Image
							src={"/images/icons/funny_icon.svg"}
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
						<span>{reactLength}</span>
					</li>
					<li>
						<Image
							src={"/images/icons/repost_icon.svg"}
							alt="icon"
							width={20}
							height={20}
							id="icon"
						/>
						<span>
							{post && post.repostsLength}
							{comment && comment.repostsLength}
							{answer && answer.answersLength}
						</span>
					</li>
					<li
						onClick={(e) => {
							e.preventDefault();
							setShowComments(!showComments);
						}}>
						{post && post?.commentsLength}
						{comment && comment?.answersLength}
						{answer && answer?.answersLength} {post && "Commentaires"}
						{comment && "Réponses"}
						{answer && "Réponses"}
					</li>
				</ul>
			</div>
		</div>
	);
}
