"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function accessOrCreateConversation(formData) {
	try {
		const uid = formData.get("userId");
		const otherUserId = formData.get("otherUserId");
		const res = await fetch(
			`${process.env.API_URI}/api/conversations?userId=${uid}&otherUserId=${otherUserId}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);
		const data = await res.json();
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export async function updateConversation(
	uid,
	otherUserId,
	prevState,
	formData
) {
	try {
		const dataTosend = {
			name: formData.get("conversation-name"),
		};
		const conversationId = formData.get("conversationId");

		const res = await fetch(
			`${process.env.API_URI}/api/conversations/${conversationId}?userId=${uid}&otherUserId=${otherUserId}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: JSON.stringify(dataTosend),
			}
		);
		const data = await res.json();
		console.log(data);
		revalidateTag("conversations");

		return {
			status: "success",
		};
	} catch (err) {
		console.log(err);
		return {
			status: "failure",
		};
	}
}
