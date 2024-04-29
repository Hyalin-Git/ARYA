import styles from "@/styles/components/aryaMedia/createRepost.module.css";
import SendCard from "./SendCard";
import { formattedDate, getAuthor } from "@/libs/utils";
import { montserrat } from "@/libs/fonts";
import Image from "next/image";
import { saveRepost } from "@/actions/repost";

export default function CreateRepost({
	uid,
	post,
	comment,
	setRepostModal,
	mutatePost,
}) {
	const saveRepostWithUid = saveRepost.bind(null, uid);
	const lastname = getAuthor(post, "lastname");
	const firstname = getAuthor(post, "firstname");
	const username = getAuthor(post, "username");
	const posterImg = post?.posterId?.picture;
	const reposterImg = post?.reposterId?.picture;
	const commenterImg = comment?.commenterId?.picture;
	return (
		<>
			<div className={styles.container}>
				<div className={styles.quit}>
					<Image
						src={"/images/icons/uncheck_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => setRepostModal(false)}
					/>
				</div>
				<div className={styles.sender}>
					<SendCard
						action={saveRepostWithUid}
						type={"repost"}
						button={"Poster"}
						postId={post._id}
						setRepostModal={setRepostModal}
						mutatePost={mutatePost}
					/>
				</div>
				<div className={styles.repost}>
					<div className={styles.header}>
						<div className={styles.user}>
							<Image
								src={
									(posterImg || reposterImg || commenterImg) ??
									"/images/profil/default-pfp.jpg"
								}
								alt="profil"
								width={50}
								height={50}
								quality={100}
							/>
							<div>
								<span>
									{firstname} {lastname}
								</span>
								<span>{username}</span>
								<span>{formattedDate(post || comment)}</span>
							</div>
						</div>
					</div>
					<div className={styles.content}>
						<div>
							<p>{post?.text}</p>
						</div>
						<div className={styles.media}>
							{post?.media?.map((img) => {
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
				</div>
				<br />
				<div className={styles.buttons}>
					<div className={styles.icons}>
						<div>
							<Image
								src="/images/icons/img_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</div>
						<div>
							<Image
								src="/images/icons/video_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</div>
						<div>
							<Image
								src="/images/icons/gif_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							form="repost"
							className={montserrat.className}>
							Poster
						</button>
					</div>
				</div>
			</div>
			<div id="overlay" onClick={(e) => setRepostModal(false)}></div>
		</>
	);
}
