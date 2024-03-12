"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createUser(prevState, formData) {
	try {
		const data = new FormData();
		data.append("lastName", formData.get("lastname"));
		data.append("firstName", formData.get("firstname"));
		data.append("userName", formData.get("username"));
		data.append("email", formData.get("email"));
		data.append("password", formData.get("password"));
		data.append("accountType", formData.get("accountType"));

		if (formData.get("accountType") === "company") {
			// For company
			data.append("name", formData.get("name"));
			formData.get("logo").name !== "undefined" &&
				data.append("logo", formData.get("logo"));

			data.append("activity", formData.get("activity")); // company & freelance
			data.append(
				"lookingForEmployees",
				formData.get("lookingForEmployees") === "yes" ? "true" : "false"
			);
		}

		if (formData.get("accountType") === "freelance") {
			// For freelance
			formData.get("cv").name !== "undefined" &&
				data.append("cv", formData.get("cv"));
			data.append("portfolio", formData.get("portfolio"));
			data.append("activity", formData.get("activity")); // company & freelance
			data.append(
				"lookingForJob",
				formData.get("lookingForJob") === "yes" ? "true" : "false"
			);
		}

		const res = await axios({
			method: "POST",
			url: "http://localhost:5000/api/auth/signUp",
			withCredentials: true,
			data: data,
			headers: {
				"Content-Type": `multipart/form-data`,
			},
		});

		return {
			isSuccess: true,
			status: "sent",
			message: `${formData.get("email")}`,
		};
	} catch (err) {
		console.log(err);

		const isInvalidLastName = err.response?.data?.message?.includes(
			"Ce nom est invalide"
		);

		const isInvalidFirstName = err.response?.data?.message?.includes(
			"Ce prénom est invalide"
		);

		const isInvalidUsername =
			err.response?.data?.message?.includes("nom d'utilisateur");

		const isInvalidEmail = err.response?.data?.message?.includes(
			"adresse mail est invalide"
		);
		const isEmailDupp =
			err.response?.data?.code === 11000 &&
			err.response?.data?.keyPattern.email === 1;
		const isUsernameDupp =
			err.response?.data?.code === 11000 &&
			err.response?.data?.keyPattern.userName === 1;
		const isInvalidPass = err.response?.data?.message?.includes("mot de passe");
		// Display errors on the form
		if (isInvalidLastName) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: true,
				isFirstname: false,
				isUsername: false,
				isEmail: false,
				isPassword: false,
			};
		}
		if (isInvalidFirstName) {
			console.log("first name issue");
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: true,
				isUsername: false,
				isEmail: false,
				isPassword: false,
			};
		}
		if (isInvalidUsername) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: false,
				isUsername: true,
				isEmail: false,
				isPassword: false,
				message: err.response.data.message,
			};
		}
		if (isUsernameDupp) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: false,
				isUsername: true,
				isEmail: false,
				isPassword: false,
				message: "Ce nom d'utilisateur est déjà utilisé",
			};
		}
		if (isInvalidEmail) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: false,
				isUsername: false,
				isEmail: true,
				isPassword: false,
				message: err.response.data.message,
			};
		}
		if (isEmailDupp) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: false,
				isUsername: false,
				isEmail: true,
				isPassword: false,
				message: "Cette adresse mail est déjà utilisée",
			};
		}
		if (isInvalidPass) {
			return {
				isSuccess: false,
				isFailure: false,
				status: "pending",
				isLastname: false,
				isFirstname: false,
				isUsername: false,
				isEmail: false,
				isPassword: true,
			};
		}
		return {
			isFailure: true,
			status: "sent",
			// message: `${formData.get("email")}`,
		};
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
			const uid = response.data.userId;
			const refreshToken = cookies().get("tempSession")?.value;
			await updateSession(refreshToken, uid);
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

export async function updateSession(token, uid) {
	try {
		const response = await axios({
			method: "POST",
			url: "http://localhost:5000/api/auth/refresh-token",
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

export async function sendResetCode(prevState, formData) {
	try {
		const response = await axios({
			method: "POST",
			url: "http://localhost:5000/api/users/forgot-password",
			withCredentials: true,
			data: {
				userEmail: formData.get("email"),
			},
		});

		if (response.status === 201) {
			return {
				isSuccess: true,
				isFailure: false,
				message:
					"Le code de réinitialisation vient d'être envoyé à l'adresse mail correspondante",
			};
		} else {
			throw new Error();
		}
	} catch (err) {
		console.log(err);
		if (err?.response?.status === 429) {
			return {
				isFailure: true,
				isSuccess: false,
				message: "Veuillez attendre 30 secondes avant de réessayer",
			};
		}
		if (err?.response?.status === 404) {
			return {
				isFailure: true,
				isSuccess: false,
				message: "L'adresse mail fournit ne correspond à aucun utilisateur",
			};
		}
		return {
			isFailure: true,
			isSuccess: false,
			message:
				"Quelque chose s'est mal passé de notre côté, veuillez réessayer",
		};
	}
}
