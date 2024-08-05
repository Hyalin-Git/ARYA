"use server";

import { cookies } from "next/headers";

export default async function saveAnswer(uid, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("text", formData.get("text"));
		dataToSend.append("commentId", formData.get("commentId"));

		const response = await fetch(
			`${process.env.API_URI}/api/answers?userId=${uid}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: dataToSend,
			}
		);

		const data = await response.json();

		console.log(data);
		return {
			status: "success",
			message: "",
		};
	} catch (err) {
		console.log(err);
	}
}
