"use server";
import { cookies } from "next/headers";
export async function saveFreelance(uid, scheduledTime, prevState, formData) {
	try {
		const isPrivate =
			formData.get("cv").name !== "undefined"
				? formData.get("privacy") === "on"
					? false
					: true
				: false;
		const isLookingForJob =
			formData.get("lookingForJob") === "on" ? true : false;
		const dataToSend = new FormData();
		formData.get("cv").name !== "undefined" &&
			dataToSend.append("cv", formData.get("cv"));
		dataToSend.append("private", isPrivate);
		dataToSend.append("lookingForJob", isLookingForJob);
		dataToSend.append("availability", scheduledTime);

		const res = await fetch(`http://localhost:5000/api/freelance/${uid}`, {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			body: dataToSend,
		});
		const data = await res.json();
		console.log(data);

		return {
			status: "success",
		};
	} catch (err) {
		console.log("throw err: ", err);
	}
}

export async function updateFreelance(uid, scheduledTime, prevState, formData) {
	try {
		const isPrivate =
			formData.get("cv")?.name !== "undefined"
				? formData.get("privacy") === "on"
					? false
					: true
				: false;
		const isLookingForJob =
			formData.get("lookingForJob") === "on" ? true : false;

		const dataToSend = new FormData();
		formData.get("cv")?.name !== "undefined" &&
			dataToSend.append("cv", formData.get("cv"));
		dataToSend.append("private", isPrivate);
		dataToSend.append("lookingForJob", isLookingForJob);
		dataToSend.append("availability", scheduledTime);
		console.log(dataToSend);
		const res = await fetch(`http://localhost:5000/api/freelance/${uid}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			body: dataToSend,
		});
		const data = await res.json();
		console.log(data);

		return {
			status: "success",
		};
	} catch (err) {
		console.log("throw err: ", err);
	}
}
