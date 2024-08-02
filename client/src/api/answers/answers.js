"use server";

import { cookies } from "next/headers";

export default async function getAnswers(commentId) {
	try {
		const response = await fetch(
			`http://arya-4pmj.onrender.com/api/answers?commentId=${commentId}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);

		const data = await response.json();

		return data;
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}
