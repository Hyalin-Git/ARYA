"use server";

import { cookies } from "next/headers";

export async function saveReportPost(uid, prevState, formData) {
	try {
		const body = {
			reporterId: uid,
			reportedPostId: formData.get("elementId"),
			reason: formData.get("reason"),
			message: formData.get("message"),
		};

		console.log(formData.get("message"));

		const res = await fetch(
			`http://localhost:5000/api/post/report?userId=${uid}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			}
		);

		const data = await res.json();
		console.log(data);

		return {
			status: "success",
			message: "Votre signalement a bien été pris en compte",
		};
	} catch (err) {
		console.log(err);
	}
}
