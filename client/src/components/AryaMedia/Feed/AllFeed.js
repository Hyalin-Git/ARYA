"use client";
import Image from "next/image";
import styles from "@/styles/components/aryaMedia/posts.module.css";
import moment from "moment";
import "moment/locale/fr";
export default function AllFeed({ posts }) {
	const reactions =
		posts.reactions.like.length +
		posts.reactions.love.length +
		posts.reactions.awesome.length +
		posts.reactions.funny.length;

	const formattedDate = moment
		.utc(posts.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
		.locale("fr")
		.fromNow();

	return (
		<article className={styles.wrapper}>
			<div className={styles.header}>
				<div className={styles.user}>
					<Image
						src={
							posts.posterId.picture
								? posts.posterId.picture
								: "/images/profil/default-pfp.jpg"
						}
						alt="profil"
						width={60}
						height={60}
						quality={100}
					/>
					<div>
						<span>
							{posts.posterId.firstName} {posts.posterId.lastName}
						</span>
						<span>{posts.posterId.userName}</span>
						<span>{formattedDate}</span>
					</div>
				</div>

				<div>
					{" "}
					<Image
						src={"/images/icons/ellipsis_icon.svg"}
						alt="icon"
						width={20}
						height={20}
					/>
				</div>
			</div>
			<div className={styles.content}>
				<p>{posts.text}</p>
				<div className={styles.reactions}>
					<ul>
						<li>{reactions}</li>
						<li>{posts.commentsLength}</li>
						<li>{posts.commentsLength} Commentaires</li>
					</ul>
				</div>
			</div>
			<div className={styles.footer}>
				<div>
					<button>Réagir</button>
					<button>Reposter</button>
					<button>Commenter</button>
				</div>
				<button>Partager</button>
			</div>
		</article>
	);
}
