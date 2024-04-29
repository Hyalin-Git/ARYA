"use server";

import { cookies } from "next/headers";
import { decryptToken, getUserId } from "../user/auth";

export async function getConversations() {
	try {
		const uid = await getUserId();
		const response = await fetch(
			`http://localhost:5000/api/conversations?userId=${uid}`,
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
	} catch (err) {
		console.log(err);
	}
}
