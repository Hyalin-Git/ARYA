"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function savePost(uid, prevState, formData) {
	try {
		const data = new FormData();
		data.append("text", formData.get("text"));
		console.log(formData.get("sendingTime"));
		data.append("date", formData.get("sendingTime").replace("T", " "));

		console.log(formData.get("sendingTime").replace("T", " "));

		console.log(formData.getAll("media"));
		if (formData.get("media").name !== "undefined") {
			const mediaFiles = formData.getAll("media");
			mediaFiles.forEach((file) => {
				data.append("media", file);
			});
		}

		const res = await axios({
			method: "POST",
			url: `http://localhost:5000/api/posts?userId=${uid}`,
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

export async function updatePost(postId, uid, prevState, formData) {
	try {
		const data = new FormData();
		data.append("text", formData.get("text"));
		const res = await axios({
			method: "PUT",
			url: `http://localhost:5000/api/posts/${postId}?userId=${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": `multipart/form-data`,
			},
			data: data,
		});
		revalidateTag("post");
		return {
			status: "success",
			message: "",
		};

		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
