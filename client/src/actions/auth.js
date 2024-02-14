"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createUser(formData) {
	console.log(formData);
}

export async function logIn(prevState, formData) {
	try {
		const response = await axios({
			method: "POST",
			url: "http://localhost:5000/api/auth/signIn",
			withCredentials: true,

			data: {
				email: formData.get("email"),
				password: formData.get("password"),
			},
		});
		const session = response.data.accessToken;
		const refreshToken = response.data.refreshToken;

		cookies().set("session", session, {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			expires: Date.now() + 15 * 60 * 1000,
			// Add domain
		});
		cookies().set("tempSession", refreshToken, {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			// Add domain
		});
	} catch (err) {
		const reponse = err?.response;
		const isEmail = reponse?.data.message.includes("Adresse mail");
		const isPassword = reponse?.data.message.includes("Mot de passe");

		if (isEmail) {
			return {
				isEmail: true,
				message: reponse.data.message,
			};
		}
		if (isPassword) {
			return {
				isPassword: true,
				message: reponse.data.message,
			};
		}
	}

	redirect("/portal");
}

export async function getSession() {
	console.log("a");
	const session = cookies().get("session")?.value;
	if (!session) return null;
	return await decryptToken(session);
}

export async function decryptToken(token) {
	try {
		const response = await axios({
			method: "GET",
			url: "http://localhost:5000/login/success",
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (err) {
		console.log(err.response.data.message.inludes("plus valide"));
	}
}

export async function updateSession(token) {
	try {
		const response = await axios({
			method: "POST",
			url: "http://localhost:5000/api/auth/refresh-token",
			withCredentials: true,
			data: {
				refreshToken: token,
			},
		});

		return response.data;
	} catch (err) {
		console.log(err.response.data.message.inludes("plus valide"));
	}
}
