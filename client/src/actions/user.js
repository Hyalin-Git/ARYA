"use server";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function updateUser(uid, prevState, formData) {
	try {
		const updatedData = {
			lastName: formData.get("lastName"),
			firstName: formData.get("firstName"),
			userName: formData.get("userName"),
			job: formData.get("job"),
			biographie: formData.get("biographie"),
			contact: formData.get("contact"),
			website: formData.get("website"),
		};

		const res = await fetch(
			`http://localhost:5000/api/users/update-user/${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			}
		);
		const data = await res.json();
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export async function updateUserSocial(uid, prevState, formData) {
	try {
		const updatedData = {
			twitter: formData.get("twitter"),
			tiktok: formData.get("tiktok"),
			instagram: formData.get("instagram"),
			facebook: formData.get("facebook"),
			linkedIn: formData.get("linkedIn"),
			youtube: formData.get("youtube"),
			twitch: formData.get("twitch"),
		};

		const res = await fetch(
			`http://localhost:5000/api/users/update-social/${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			}
		);
		const data = await res.json();
		console.log(data);
	} catch (err) {
		console.log(err);
	}
}

export async function updateUserTools(uid, tools, prevState, formData) {
	try {
		let array;

		if (formData) {
			if (formData.get("tool").length <= 0) {
				array = [...tools];
			} else {
				console.log("played bro");
				array = [...tools, formData.get("tool")];
			}
		} else {
			array = [...tools];
		}

		const toolsData = {
			tools: array,
		};
		const res = await fetch(
			`http://localhost:5000/api/users/update-tools/${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(toolsData),
			}
		);
		const data = await res.json();
		console.log(data);

		return {
			status: "success",
			data: data.tools,
		};
	} catch (err) {
		console.log(err);
	}
}

export async function updateForgotPassword(prevState, formData) {
	try {
		const res = await axios({
			method: "PUT",
			url: "http://localhost:5000/api/users/forgot-password",
			withCredentials: true,
			data: {
				resetCode: cookies().get("code")?.value,
				newPassword: formData.get("newPassword"),
				confirmNewPassword: formData.get("confirmNewPassword"),
			},
		});
		console.log(res);
		if (res.status === 200) {
			cookies().delete("code");
			return {
				isSuccess: true,
				isFailure: false,
				message: "Mot de passe réinitialisation avec succès !",
			};
		} else {
			throw new Error();
		}
	} catch (err) {
		if (err?.response?.status === 404) {
			const hasExpired = err.response.data.message.includes("expiré");
			const userNotFound = err.response.data.message.includes(
				"Aucun utilisateur trouvé"
			);
			if (hasExpired) {
				return {
					isFailure: true,
					isSuccess: false,
					isPassword: false,
					message: "Votre code a expiré, veuillez réessayer",
				};
			}
			if (userNotFound) {
				return {
					isFailure: true,
					isSuccess: false,
					isPassword: false,
					message:
						"Impossible de modifier le mot de passe d'un utilisateur inexistant, veuillez réessayer",
				};
			}
		}
		if (err?.response?.status === 400) {
			const notVerified = err.response.data.message.includes("vérifié");
			const notValidPassword = err.response.data.message.includes(
				"mot de passe doit contenir"
			);
			const samePassword = err.response.data.message.includes(
				"nouveau mot de passe"
			);
			if (notVerified) {
				return {
					isFailure: true,
					isSuccess: false,
					isPassword: false,
					message: "Votre code n'est pas vérifié, veuillez réessayer",
				};
			}
			if (notValidPassword) {
				return {
					isFailure: false,
					isSuccess: false,
					isPassword: true,
					message: "Mot de passe invalide",
				};
			}
			if (samePassword) {
				return {
					isFailure: true,
					isSuccess: false,
					isPassword: false,
					message:
						"Le nouveau mot de passe ne peut pas être l'ancien mot de passe",
				};
			}
		}
		return {
			isFailure: true,
			isSuccess: false,
			message:
				"Quelque chose s'est mal passé de notre côté, veuillez réessayer",
		};
	}
}
