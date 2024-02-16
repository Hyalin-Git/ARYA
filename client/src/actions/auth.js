"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// import FormData from "form-data";
export async function createUser(formData) {
	try {
		const data = new FormData();
		data.append("lastName", formData.get("lastname"));
		data.append("firstName", formData.get("firstname"));
		data.append("userName", formData.get("username"));
		data.append("email", formData.get("email"));
		data.append("password", formData.get("password"));
		data.append("accountType", formData.get("accountType"));
		data.append("name", formData.get("name"));
		data.append("logo", formData.get("logo"));
		data.append("activity", formData.get("activity"));
		data.append(
			"lookingForEmployees",
			formData.get("lookingForEmployees") === "yes" ? "true" : "false"
		);
		console.log(data);
		const res = await axios({
			method: "POST",
			url: "http://localhost:5000/api/auth/signUp",
			withCredentials: true,
			data: data,
			headers: {
				"Content-Type": `multipart/form-data`,
			},
		});

		console.log(res);
	} catch (err) {
		console.log(err);
		// Display errors on the form
	}
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
			expires: Date.now() + 30 * 60 * 1000,
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
		const date = new Date();
		const convertedDate = new Date(0);
		convertedDate.setUTCSeconds(response.data.exp);
		const actualDate = date;
		const differenceInMilliseconds = Math.abs(actualDate - convertedDate);
		const twoMinutesInMilliseconds = 2 * 60 * 1000; // Une minute en millisecondes

		if (differenceInMilliseconds <= twoMinutesInMilliseconds) {
			console.log("played");
			const refreshToken = cookies().get("tempSession")?.value;
			await updateSession(refreshToken);
		}

		return response.data;
	} catch (err) {
		const isNotValid = err.response.data.message.includes("aucun token reçu");

		const hasExpired = err.response.data.message.includes("plus valide");
		if (err.response.status === 403 && isNotValid) {
			console.log("yas queen");
			cookies().delete("session");
			redirect("/");
		}
		if (err.response.status === 403 && hasExpired) {
			cookies().delete("session");
		}
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
				userId: "6576eb91261716e3bf05fdab",
			},
		});

		const session = response.data.newAccessToken;
		cookies().set("session", session, {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			expires: Date.now() + 15 * 60 * 1000,
			// Add domain
		});
	} catch (err) {
		return redirect("/auth");
	}
}

export async function logout() {
	cookies().delete("session");
	cookies().delete("tempSession");
}
