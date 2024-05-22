"use server";
import styles from "@/styles/pages/user.module.css";
import { getUserByUsername } from "@/api/user/user";
import Link from "next/link";
import ConversationPanel from "@/layouts/social/aside/ConversationPanel";
import UserPanel from "@/layouts/social/aside/UserPanel";

export default async function User({ params }) {
	const user = await getUserByUsername(params.slug[0]);

	function isActive(path) {
		return params?.slug[1]?.includes(path);
	}

	return (
		<main className={styles.container}>
			<aside>
				<UserPanel fetchedUser={user} />
			</aside>
			<div className={styles.content}>
				<div className={styles.filters}>
					<ul>
						<Link href={`/user/${user.userName}/posts`}>
							<li data-active={isActive("posts")}>Posts</li>
						</Link>
						<Link href={`/user/${user.userName}/reposts`}>
							<li data-active={isActive("reposts")}>Reposts</li>
						</Link>
						<Link href={`/user/${user.userName}/commentaires`}>
							<li data-active={isActive("commentaires")}>Commentaires</li>
						</Link>
						<Link href={`/user/${user.userName}/aime`}>
							<li data-active={isActive("aime")}>J'aime</li>
						</Link>
						<li>/</li>
						<Link href={`/user/${user.userName}/cv`}>
							<li data-active={isActive("cv")}>CV</li>
						</Link>
						<Link href={`/user/${user.userName}/services`}>
							<li data-active={isActive("services")}>Services</li>
						</Link>
						<Link href={`/user/${user.userName}/planning`}>
							<li data-active={isActive("planning")}>Planning</li>
						</Link>
					</ul>
				</div>
				<div className={styles.feed}>
					{isActive("posts") && <div>posts</div>}
					{isActive("reposts") && <div>reposts</div>}
					{isActive("commentaires") && <div>commentaires</div>}
					{isActive("aime") && <div>j'aime</div>}
					{isActive("cv") && <div>cv</div>}
					{isActive("planning") && <div>planning</div>}
				</div>
			</div>
			<aside>
				<ConversationPanel />
			</aside>
		</main>
	);
}
