"use server";
import { cookies } from "next/headers";

export async function getComments(postId) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/comments?postId=${postId}`,
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
