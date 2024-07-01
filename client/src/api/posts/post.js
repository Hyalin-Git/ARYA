"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getPost(postId) {
	try {
		const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": "application/json",
			},
			next: {
				tags: ["post"],
			},
		});

		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function getPosts(posterId, sortByDate) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/posts?posterId=${posterId}&sortByDate=${sortByDate}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				next: {
					tags: ["post"],
				},
			}
		);

		const data = await res.json();
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function deletePost(postId, uid) {
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

		revalidateTag("post");
	} catch (err) {
		console.log(err);
	}

	redirect("/social");
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

		revalidateTag("post");
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
		revalidateTag("post");
	} catch (err) {
		console.log(err);
	}
}
