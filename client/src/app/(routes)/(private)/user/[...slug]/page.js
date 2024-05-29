"use server";
import styles from "@/styles/pages/user.module.css";
import { getUserByUsername } from "@/api/user/user";
import Link from "next/link";
import ConversationPanel from "@/layouts/social/aside/ConversationPanel";
import UserPanel from "@/layouts/social/aside/UserPanel";
import Posts from "@/components/user/posts/Posts";
import Reposts from "@/components/user/reposts/Reposts";
import Likes from "@/components/user/likes/Likes";

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
						<Link href={`/user/${user.userName}/dick`}>
							<li data-active={isActive("dick")}>Reposts</li>
						</Link>
						<Link href={`/user/${user.userName}/commentaires`}>
							<li data-active={isActive("commentaires")}>Commentaires</li>
						</Link>
						<Link href={`/user/${user.userName}/reactions`}>
							<li data-active={isActive("reactions")}>Réactions</li>
						</Link>
						<Link href={`/user/${user.userName}/images`}>
							<li data-active={isActive("images")}>Images</li>
						</Link>
						<li>/</li>
						<Link href={`/user/${user.userName}/projects`}>
							<li data-active={isActive("projects")}>Projets</li>
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
					{isActive("posts") && <Posts user={user} />}
					{isActive("dick") && <Reposts user={user} />}
					{isActive("commentaires") && <div>commentaires</div>}
					{isActive("reactions") && <Likes user={user} />}
					{isActive("images") && <div>img</div>}
					{isActive("projects") && <div>Projets</div>}
					{isActive("planning") && <div>planning</div>}
				</div>
			</div>
			<aside>
				<ConversationPanel />
			</aside>
		</main>
	);
}
