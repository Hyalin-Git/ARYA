"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function saveComment(postId, type, prevState, formData) {
	try {
		const data = new FormData();

		data.append(type === "post" ? "postId" : "repostId", postId);
		data.append("text", formData.get("text"));
		const res = await axios({
			method: "POST",
			url: "http://localhost:5000/api/comments?userId=65e84d8f5b4447f020ca2746",
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});

		revalidateTag("comments");

		return {
			status: "success",
			message: "",
		};

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}

export async function updateComment(commentId, uid, prevState, formData) {
	try {
		const data = new FormData();
		data.append("text", formData.get("text"));
		const res = await axios({
			method: "PUT",
			url: `http://localhost:5000/api/comments/${commentId}?userId=${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});

		revalidateTag("comments");

		return {
			status: "success",
			message: "",
		};

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
