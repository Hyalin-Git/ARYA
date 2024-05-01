import styles from "@/styles/components/social/cards/cardBody.module.css";
import Image from "next/image";
import UpdateCard from "./UpdateCard";
import { formattedDate, reactionLength } from "@/libs/utils";
import { updatePost } from "@/actions/post";
import { updateRepost } from "@/actions/repost";
import { updateComment } from "@/actions/comment";

export default function CardBody({
	uid,
	element,
	type,
	isUpdate,
	setIsUpdate,
	showComments,
	setShowComments,
	mutatePost,
	mutateComment,
}) {
	const updatePostWithId = updatePost.bind(null, element?._id, uid);
	const updateRepostWithId = updateRepost.bind(null, element?._id, uid);
	const updateCommentWithId = updateComment.bind(null, element?._id, uid);
	// const updateCommentWithId = updateComment.bind(null, comment?._id, uid);
	const reactLength = reactionLength(element);
	return (
		<div className={styles.container}>
			<div >
				{isUpdate ? (
					<UpdateCard
						element={element}
						type={type}
						action={
							(type === "post" && updatePostWithId) ||
							(type === "repost" && updateRepostWithId) ||
							(type === "comment" && updateCommentWithId)
						}
						setIsUpdate={setIsUpdate}
						mutatePost={mutatePost}
						mutateComment={mutateComment}
					/>
				) : (
					<p>{element?.text}</p>
				)}
			</div>
			<div className={styles.media}>
				{element?.media?.map((img, idx) => {
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
			</div>
			{type === "repost" && (
				<div className={styles.repost}>
					{!element?.postId?.text && !element?.postId?.media ? (
						<div>
							<p>Publication supprimé</p>
						</div>
					) : (
						<>
							<div className={styles.header}>
								<div className={styles.user}>
									<Image
										src={
											element?.postId?.posterId?.picture ??
											"/images/profil/default-pfp.jpg"
										}
										alt="profil"
										width={40}
										height={40}
										quality={100}
									/>
									<div>
										<span>
											{element?.postId?.posterId?.firstName}{" "}
											{element?.postId?.posterId?.lastName}
										</span>
										<span>{element?.postId?.posterId?.userName}</span>
										<span>{formattedDate(element?.postId)}</span>
									</div>
								</div>
							</div>
							<div className={styles.content}>
								<div>
									<p>{element?.postId?.text}</p>
								</div>
								<div className={styles.media}>
									{element?.postId?.media?.map((img) => {
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
							{type === "post" && element.repostsLength}
							{type === "comment" && element.repostsLength}
							{type === "post" && element.answersLength}
						</span>
					</li>
					<li
						onClick={(e) => {
							e.preventDefault();
							setShowComments(!showComments);
						}}>
						{(type === "post" || type === "repost") && element?.commentsLength}
						{(type === "comment" || type === "answer") &&
							element?.answersLength}{" "}
						{(type === "post" || type === "repost") && "Commentaires"}
						{(type === "comment" || type === "answer") && "Réponses"}
					</li>
				</ul>
			</div>
		</div>
	);
}
