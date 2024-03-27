"use server";
import { cookies } from "next/headers";

export async function getFeed(limit) {
	try {
		console.log(limit);
		const res = await fetch(`http://localhost:5000/api/feed?limit=${limit}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				//  "Content-Type": "application/json",
				// "Content-Type": "application/x-www-form-urlencoded",
			},
		});
		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}
