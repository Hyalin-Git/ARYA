"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getComment(commentId) {
	try {
		const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": "application/json",
			},
			next: {
				tags: ["comment"],
			},
		});

		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function getComments(postId, type) {
	try {
		console.log(type);
		const res = await fetch(
			`http://localhost:5000/api/comments?${
				type === "post" ? "postId" : "repostId"
			}=${postId}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					//  "Content-Type": "application/json",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
				next: {
					tags: ["comments"],
				},
			}
		);
		const data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
	}
}

export default async function deleteComment(commentId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/comments/${commentId}?userId=${uid}`,
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

		console.log(data);
	} catch (err) {
		console.log(err);
	}

	redirect("/social");
}

export async function addCommentReaction(commentId, uid, reaction) {
	try {
		const reactionData = {
			reaction: reaction,
		};
		const res = await fetch(
			`http://localhost:5000/api/comments/add-react/${commentId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
				body: JSON.stringify(reactionData),
			}
		);
		const data = await res.json();

		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export async function deleteCommentReaction(commentId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/comments/delete-react/${commentId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		const data = await res.json();

		console.log(data);
	} catch (err) {
		console.log(err);
	}
}
