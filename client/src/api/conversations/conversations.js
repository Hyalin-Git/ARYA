"use server";

import { cookies } from "next/headers";
import { getUserId } from "../user/auth";
import { revalidateTag } from "next/cache";

export async function getConversations() {
	try {
		const uid = await getUserId();

		const response = await fetch(
			`${process.env.API_URI}/api/conversations?userId=${uid}`,
			{
				method: "GET",
				credentials: "include",

				headers: {
					authorization: `Bearer ${cookies().get("session")?.value}`,
					"Access-Control-Allow-Origin": "http://localhost:3000:",
				},
				next: { tags: ["conversations"] },
			}
		);

		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function revalidateConversations() {
	revalidateTag("conversations");
}

export async function getConversation(conversationId, otherUserId) {
	try {
		const uid = await getUserId();
		const response = await fetch(
			`${process.env.API_URI}/api/conversations/${conversationId}?userId=${uid}&otherUserId=${otherUserId}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);

		const data = await response.json();

		console.log("the fucking conversation", response.status);

		return { data: data, isBlocked: response.status === 403 ? true : false };
	} catch (err) {
		console.log(err);
	}
}
