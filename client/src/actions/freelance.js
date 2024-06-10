"use server";
import { cookies } from "next/headers";
export default async function saveFreelance(uid, prevState, formData) {
	try {
		const res = await fetch(`http://localhost:5000/api/freelance/${uid}`, {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
		});
		const data = await res.json();
		console.log(data);
	} catch (err) {
		console.log("throw err: ", err);
	}
}
