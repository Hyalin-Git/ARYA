"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export default async function deletePost(postId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/posts/${postId}?userId=${uid}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await res.json();
	} catch (err) {
		console.log(err);
	}
}

export async function addReaction(postId, uid, reaction) {
	try {
		const reactionData = {
			reaction: reaction,
		};
		const res = await fetch(
			`http://localhost:5000/api/posts/add-react/${postId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reactionData),
			}
		);
		const data = await res.json();
	} catch (err) {
		console.log(err);
	}
}

export async function deleteReaction(postId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/posts/delete-react/${postId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await res.json();
	} catch (err) {
		console.log(err);
	}
}
