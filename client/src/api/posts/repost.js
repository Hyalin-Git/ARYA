"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getRepost(repostId) {
	try {
		const res = await fetch(`http://localhost:5000/api/reposts/${repostId}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": "application/json",
			},
			next: {
				tags: ["repost"],
			},
		});

		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export default async function deleteRepost(repostId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/reposts/${repostId}?userId=${uid}`,
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
		revalidateTag("repost");
		console.log(data);
	} catch (err) {
		console.log(err);
	}

	redirect("/social");
}

export async function addRepostReaction(repostId, uid, reaction) {
	try {
		const reactionData = {
			reaction: reaction,
		};
		const res = await fetch(
			`http://localhost:5000/api/reposts/add-react/${repostId}?userId=${uid}`,
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

		revalidateTag("repost");
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export async function deleteRepostReaction(repostId, uid) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/reposts/delete-react/${repostId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
			}
		);
		revalidateTag("repost");
		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
