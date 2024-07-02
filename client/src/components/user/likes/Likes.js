"use server";
import { getUserLikes } from "@/api/user/user";
import Card from "@/components/social/cards/Card";
import { checkIfEmpty } from "@/libs/utils";
import styles from "@/styles/components/user/posts/posts.module.css";
import Image from "next/image";

export default async function Likes({ user }) {
	const res = await getUserLikes(user._id);
	const likes = res?.data;
	console.log(likes, "les likes mec");
	return (
		<div>
			{!checkIfEmpty(likes) ? (
				likes.map((like) => {
					return <Card element={like} key={like._id} />;
				})
			) : (
				<div className={styles.empty}>
					<Image
						src={"/images/illustrations/no-post.png"}
						alt="illustration"
						width={320}
						height={320}
						style={{
							position: "relative",
						}}
						quality={100}
					/>
					<span>Cet utilisateur n'a encore réagit à aucune publication</span>
				</div>
			)}
		</div>
	);
}
