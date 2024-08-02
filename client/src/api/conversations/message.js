"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function getMessages(conversationId) {
	try {
		const response = await fetch(
			`https://arya-jnnv.onrender.com/api/messages?conversationId=${conversationId}`,
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

export async function addToRead(messageId, uid) {
	try {
		const response = await fetch(
			`https://arya-jnnv.onrender.com/api/messages/add-read/${messageId}?userId=${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);

		const data = await response.json();

		console.log("====================================");
		console.log(data);
		console.log("====================================");
		revalidateTag("conversations");
		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function deleteMessage(messageId, uid) {
	try {
		const response = await fetch(
			`https://arya-jnnv.onrender.com/api/messages/${messageId}?userId=${uid}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);

		const data = await response.json();

		console.log("====================================");
		console.log(data);
		console.log("====================================");

		return data;
	} catch (err) {
		console.log(err);
	}
}
