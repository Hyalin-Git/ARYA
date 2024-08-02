"use server";
import axios from "axios";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { decryptToken, getUserId } from "./auth";

export async function getUsers(interest, limit) {
	try {
		const res = await fetch(
			`http://arya-tyxp.vercel.app/api/users?limit=${
				limit ? limit : ""
			}&interest=${interest ? interest : ""}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
				next: {
					tags: ["users"],
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
			url: `http://arya-tyxp.vercel.app/api/users/${uid}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
			next: {
				tags: ["user"],
			},
		});

		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}

// Get user by username
export async function getUserByUsername(username) {
	try {
		const res = await fetch(
			`http://arya-tyxp.vercel.app/api/users/username/${username}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				next: {
					tags: ["user"],
				},
			}
		);

		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function getUserLikes(userId) {
	try {
		const res = await fetch(
			`http://arya-tyxp.vercel.app/api/users/likes/${userId}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				next: {
					tags: ["user"],
				},
			}
		);

		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
	}
}

// Block logic

export async function getBlockedUsers() {
	try {
		const uid = await getUserId();
		const response = await fetch(
			`http://arya-tyxp.vercel.app/api/users/block/${uid}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				next: {
					tags: ["blockedUsers"],
				},
			}
		);
		const data = await response.json();

		return data.blockedUsers;
	} catch (err) {
		console.log(err);
	}
}

// Follow logic

export async function getFollowSuggestions(limit) {
	try {
		const uid = await getUserId();
		const response = await axios.get(
			`http://arya-tyxp.vercel.app/api/users/suggestion/${uid}`,
			{
				params: {
					limit: limit || 3,
				},
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				withCredentials: true,
				// Remarque : la configuration "next: { tags: ['suggestion'] }" n'est pas directement applicable avec axios,
				// vous devrez peut-être gérer cette partie séparément selon vos besoins.
			}
		);

		return response.data;
	} catch (err) {
		console.log(err);
	}
}
export async function follow(uid, idToFollow) {
	try {
		console.log(uid, idToFollow);
		const response = await fetch(
			`http://arya-tyxp.vercel.app/api/users/follow?userId=${uid}&idToFollow=${idToFollow}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();
		revalidateTag("suggestion");
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function unFollow(uid, idToUnfollow) {
	try {
		const response = await fetch(
			`http://arya-tyxp.vercel.app/api/users/unfollow?userId=${uid}&idToUnfollow=${idToUnfollow}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		revalidateTag("suggestion");
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}
