"use server";
import { cookies } from "next/headers";

export default async function saveCompany(uid, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("name", formData.get("name"));
		formData.get("image").name !== undefined &&
			dataToSend.append("logo", formData.get("image"));
		dataToSend.append("activity", formData.get("activity"));
		dataToSend.append("bio", formData.get("biographie"));
		dataToSend.append(
			"lookingForEmployees",
			formData.get("lookingForEmployees") === "on" ? true : false
		);
		const res = await fetch(`http://localhost:5000/api/company?userId=${uid}`, {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			body: dataToSend,
		});
		const data = await res.json();
		console.log(data);
	} catch (err) {
		console.log("throw err: ", err);
	}
}

export async function updateCompany(uid, companyId, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("name", formData.get("name"));

		formData.get("pict")?.name !== "undefined" &&
			dataToSend.append("logo", formData.get("pict"));
		dataToSend.append("activity", formData.get("activity"));
		dataToSend.append("bio", formData.get("biographie"));
		dataToSend.append(
			"lookingForEmployees",
			formData.get("lookingForEmployees") === "on" ? true : false
		);
		const res = await fetch(
			`http://localhost:5000/api/company/${companyId}?userId=${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: dataToSend,
			}
		);
		const data = await res.json();
		console.log(data);

		return {
			status: "success",
		};
	} catch (err) {
		console.log("throw err: ", err);
	}
}
