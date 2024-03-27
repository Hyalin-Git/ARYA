"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getUsers(interest, limit) {
	try {
		const res = await fetch(
			`http://localhost:5000/api/users?limit=${limit ? limit : ""}&interest=${
				interest ? interest : ""
			}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function getUser(uid) {
	try {
		const res = await axios({
			method: "GET",
			url: `http://localhost:5000/api/users/${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
		});

		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}
