"use server";

import { cookies } from "next/headers";

export async function accessOrCreateConversation(formData) {
	try {
		const uid = formData.get("userId");
		const otherUserId = formData.get("otherUserId");
		const res = await fetch(
			`https://arya-tyxp.vercel.app/api/conversations?userId=${uid}&otherUserId=${otherUserId}`,
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
