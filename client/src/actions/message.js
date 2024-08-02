"use server";

import { extractURL } from "@/libs/utils";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
export async function saveMessage(uid, prevState, formData) {
	try {
		let message = formData.get("message");
		const dataToSend = new FormData();
		const urls = extractURL(message);

		if (urls.length > 0) {
			let modifiedMessage = message;
			for (let i = 0; i < urls.length; i++) {
				if (
					urls[i].includes("https://www.yout") ||
					urls[i].includes("https://yout")
				) {
					const element = urls[i];
					let modifiedElement = element.replace("watch?v=", "embed/");
					modifiedElement = modifiedElement.split("&")[0];

					modifiedMessage = modifiedMessage.replace(element, modifiedElement);
				}
			}

			dataToSend.append("content", modifiedMessage);
		} else {
			dataToSend.append("content", message);
		}

		dataToSend.append("conversationId", formData.get("conversationId"));
		if (formData.get("img")?.name !== "undefined") {
			const mediaFiles = formData.getAll("img");
			mediaFiles.forEach((file) => {
				dataToSend.append("media", file);
			});
		}

		const res = await fetch(
			`http://arya-tyxp.vercel.app/api/messages?userId=${uid}`,
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
		if (!res.ok) {
			throw new Error(data.message);
		}
		return { status: "success", data: data };
	} catch (err) {
		console.log(err, "from err");
		return {
			status: "failure",
		};
	}
}

export async function updateMessage(uid, messageId, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("content", formData.get("content"));

		const res = await fetch(
			`http://arya-tyxp.vercel.app/api/messages/${messageId}?userId=${uid}`,
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
