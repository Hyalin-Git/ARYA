"use server";
import axios from "axios";
import { cookies } from "next/headers";




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
