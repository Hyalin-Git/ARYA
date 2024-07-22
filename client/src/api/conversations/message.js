"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function getMessages(conversationId) {
	try {
		const response = await fetch(
			`http://localhost:5000/api/messages?conversationId=${conversationId}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				next: { tags: ["messages"] },
			}
		);

		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function revalidateMessages() {
	revalidateTag("messages");
}
