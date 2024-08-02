"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function savePost(uid, scheduledTime, prevState, formData) {
	try {
		console.log(scheduledTime);
		const data = new FormData();
		data.append("text", formData.get("text"));
		console.log(formData.get("sendingTime"));
		data.append("date", scheduledTime);

		// console.log(formData.get("sendingTime").replace("T", " "));

		console.log(formData.getAll("media"));
		console.log(formData.getAll("gif"));
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
			url: `https://arya-jnnv.onrender.com/api/posts?userId=${uid}`,
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
			url: `https://arya-jnnv.onrender.com/api/posts/${postId}?userId=${uid}`,
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
