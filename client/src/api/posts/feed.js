"use server";
import { cookies } from "next/headers";

export async function getAllFeed(offset, limit) {
	try {
		const res = await fetch(
			`${process.env.API_URI}/api/feed?offset=${offset}&limit=${limit}`,
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

export async function getFollowingFeed(offset, limit) {
	try {
		const res = await fetch(
			`${process.env.API_URI}/api/feed/for-me?offset=${offset}&limit=${limit}`,
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
