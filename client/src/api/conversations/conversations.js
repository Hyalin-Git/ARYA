"use server";

import { cookies } from "next/headers";
import { decryptToken } from "../user/auth";

export async function getConversations() {
	try {
		// const userId = decryptToken(cookies().get("session")?.value);
		const response = await fetch(
			`http://localhost:5000/api/conversations?userId=${"65e84d8f5b4447f020ca2746"}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);

		const data = await response.json();
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}
