"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
export async function saveMessage(uid, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("content", formData.get("message"));
		dataToSend.append("conversationId", formData.get("conversationId"));
		if (formData.get("img")?.name !== "undefined") {
			const mediaFiles = formData.getAll("img");
			mediaFiles.forEach((file) => {
				dataToSend.append("media", file);
			});
		}

		const res = await fetch(
			`http://localhost:5000/api/messages?userId=${uid}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: dataToSend,
			}
		);
		const data = await res.json();
		console.log(data);

		return { status: "success", data: data };
	} catch (err) {
		console.log(err);
	}
}

export async function updateMessage(uid, messageId, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("content", formData.get("content"));
		if (formData.get("img")?.name !== "undefined") {
			const mediaFiles = formData.getAll("img");
			mediaFiles.forEach((file) => {
				dataToSend.append("media", file);
			});
		}

		const res = await fetch(
			`http://localhost:5000/api/messages/${messageId}?userId=${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: dataToSend,
			}
		);
		const data = await res.json();
		console.log(data);

		return { status: "success", data: data };
	} catch (err) {
		console.log(err);
	}
}
