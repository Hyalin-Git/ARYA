"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function getUserId() {
	try {
		const response = await axios({
			method: "GET",
			url: "https://arya-tyxp.vercel.app/login/success",
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
		});

		return response?.data?.userId;
	} catch (err) {
		const isNotValid = err.response?.data?.message.includes("aucun token reçu");

		const hasExpired = err.response?.data?.message.includes("plus valide");
		if (err.response?.status === 403 && isNotValid) {
			console.log("yas queen");
			cookies().delete("session");
			redirect("/");
		}
		if (err.response?.status === 403 && hasExpired) {
			cookies().delete("session");
		}
	}
}
export async function getSession() {
	const session = cookies().get("session")?.value;
	if (!session) return null;
	return await decryptToken(session);
}

export async function decryptToken(token) {
	try {
		const response = await axios({
			method: "GET",
			url: "https://arya-tyxp.vercel.app/login/success",
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const date = new Date();
		const convertedDate = new Date(0);
		convertedDate.setUTCSeconds(response.data.exp);
		const actualDate = date;
		const differenceInMilliseconds = Math.abs(actualDate - convertedDate);
		const twoMinutesInMilliseconds = 13 * 60 * 1000; // Une minute en millisecondes

		if (differenceInMilliseconds <= twoMinutesInMilliseconds) {
			console.log("played");
			const uid = response.data.userId;
			await getRefreshToken(token, uid);
		}

		return response?.data?.userId;
	} catch (err) {
		const isNotValid = err.response?.data?.message.includes("aucun token reçu");

		const hasExpired = err.response?.data?.message.includes("plus valide");
		if (err.response?.status === 403 && isNotValid) {
			console.log("yas queen");
			cookies().delete("session");
			redirect("/");
		}
		if (err.response?.status === 403 && hasExpired) {
			cookies().delete("session");
		}
	}
}

export async function getRefreshToken(token, uid) {
	try {
		const response = await axios({
			method: "GET",
			url: `https://arya-tyxp.vercel.app/api/auth/refresh-token?userId=${uid}`,
			withCredentials: true,
		});

		console.log(response.data);
		const refreshToken = response.data.refreshToken;
		await updateSession(refreshToken, uid);
		return response.data;
	} catch (err) {
		console.log(err);
	}
}

export async function updateSession(token, uid) {
	try {
		const response = await axios({
			method: "POST",
			url: "https://arya-tyxp.vercel.app/api/auth/refresh-token",
			withCredentials: true,
			data: {
				refreshToken: token,
				userId: uid,
			},
		});

		console.log(response.data);
		const session = response.data.newAccessToken;
		cookies().set("session", session, {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			expires: Date.now() + 15 * 60 * 1000,
			// Add domain
		});
	} catch (err) {
		console.log(err);
		return redirect("/auth");
	}
}

export async function logout() {
	cookies().delete("session");
	cookies().delete("tempSession");
}
