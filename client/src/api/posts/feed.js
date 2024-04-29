"use server";
import { cookies } from "next/headers";

export async function getAllFeed(offset, limit) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/feed?offset=${offset}&limit=${limit}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				next: {
					tags: ["feed"],
				},
			}
		);
		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function getFollowingFeed(limit) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/feed/for-me?limit=${limit}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				next: {
					tags: ["feed"],
				},
			}
		);
		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}
