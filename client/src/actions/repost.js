"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import axios from "axios";

export async function saveRepost(uid, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("text", formData.get("text"));
		dataToSend.append("postId", formData.get("postId"));
		// dataToSend.append("repostId", formData.get("repostId"));

		const response = await fetch(
			`https://arya-jnnv.onrender.com/api/reposts?userId=${uid}`,
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

export async function updateRepost(repostId, uid, prevState, formData) {
	try {
		const data = new FormData();
		data.append("text", formData.get("text"));
		const res = await axios({
			method: "PUT",
			url: `https://arya-jnnv.onrender.com/api/reposts/${repostId}?userId=${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});

		console.log(res.data);
		revalidateTag("repost");
		return {
			status: "success",
			message: "",
		};
	} catch (err) {
		console.log(err);
	}
}
