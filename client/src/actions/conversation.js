"use server";

import { cookies } from "next/headers";

export async function accessOrCreateConversation() {
	try {
		const uid = "";
		const otherUserId = "";
		const res = await fetch(
			`http://localhost:5000/api/conversations?userId=${uid}&otherUserId=${otherUserId}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
			}
		);
		const data = await res.json();
	} catch (err) {}
}
