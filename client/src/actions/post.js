"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function savePost(prevState, formData) {
	try {
		const data = new FormData();
		data.append("text", formData.get("text"));
		const res = await axios({
			method: "POST",
			url: "http://localhost:5000/api/posts?userId=65e84d8f5b4447f020ca2746",
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});

		revalidateTag("feed");

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}

export async function addReaction(postId, formData) {
	try {
		const res = await axios({
			method: "PATCH",
			url: `http://localhost:5000/api/posts/add-react/${postId}?userId=65e84d8f5b4447f020ca2746`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			data: {
				reaction: formData.get("reaction"),
			},
		});

		revalidateTag("feed");

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}

export async function deleteReaction(postId, formData) {
	try {
		const res = await axios({
			method: "PATCH",
			url: `http://localhost:5000/api/posts/delete-react/${postId}?userId=65e84d8f5b4447f020ca2746`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			data: {
				reaction: formData.get("reaction"),
			},
		});

		revalidateTag("feed");

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
