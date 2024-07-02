"use server";
import styles from "@/styles/components/user/posts/posts.module.css";
import { getReposts } from "@/api/posts/repost";
import Card from "@/components/social/cards/Card";
import { checkIfEmpty } from "@/libs/utils";
import Image from "next/image";

export default async function Reposts({ user }) {
	const res = await getReposts(user._id);
	const reposts = res?.data;
	console.log(reposts);

	return (
		<div className={styles.container}>
			{!checkIfEmpty(reposts) ? (
				reposts.map((repost) => {
					return <Card element={repost} key={repost._id} />;
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
					<span>Cet utilisateur n'a encore rien publié</span>
				</div>
			)}
		</div>
	);
}
