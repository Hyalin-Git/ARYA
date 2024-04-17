import styles from "@/styles/components/aryaMedia/createRepost.module.css";
import SendCard from "./SendCard";
import { formattedDate } from "@/libs/utils";
import { montserrat } from "@/libs/fonts";
import Image from "next/image";
import { saveRepost } from "@/actions/repost";

export default function CreateRepost({ post, setRepostModal, mutatePost }) {
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
						action={saveRepost}
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
								src={post?.posterId.picture ?? "/images/profil/default-pfp.jpg"}
								alt="profil"
								width={50}
								height={50}
								quality={100}
							/>
							<div>
								<span>
									{post?.posterId.firstName} {post?.posterId.lastName}
								</span>
								<span>{post?.posterId.userName}</span>
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
