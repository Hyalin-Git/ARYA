"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function saveComment(uid, postId, type, prevState, formData) {
	try {
		const data = new FormData();

		data.append(type === "post" ? "postId" : "repostId", postId);
		data.append("text", formData.get("text"));
		console.log(formData.getAll("media"));
		if (formData.get("media").name !== "undefined") {
			const mediaFiles = formData.getAll("media");
			mediaFiles.forEach((file) => {
				data.append("media", file);
			});
		}
		if (formData.get("gif") !== "undefined") {
			const gifs = formData.getAll("gif");
			gifs.forEach((file) => {
				data.append("gif", file);
			});
		}
		const res = await axios({
			method: "POST",
			url: `http://arya-tyxp.vercel.app/api/comments?userId=${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});

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
			url: `http://arya-tyxp.vercel.app/api/comments/${commentId}?userId=${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});
		revalidateTag("comment");
		return {
			status: "success",
			message: "",
		};

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
