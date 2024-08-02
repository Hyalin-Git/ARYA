"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function reSendVerifyEmail(prevState, formData) {
	try {
		const res = await axios({
			method: "POST",
			url: `https://arya-tyxp.vercel.app/api/verification/send-verification-mail`,
			withCredentials: true,
			data: {
				userEmail: formData.get("email"),
			},
		});
		console.log(res);

		return {
			isSuccess: true,
			isFailure: false,
			message: "Un nouveau mail de confirmation vient d'être envoyé",
		};
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
		// const message = err?.response?.data?.message;
		// throw new Error(message || "Une erreur est survenue");
	}
}

export async function verifyResetPasswordCode(prevState, formData) {
	try {
		const res = await axios({
			method: "PUT",
			url: "https://arya-tyxp.vercel.app/api/verification/reset-code-verify",
			withCredentials: true,
			data: {
				resetCode: formData.get("code"),
			},
		});

		if (res.status === 200) {
			const resetCode = res.data.resetCode;
			cookies().set("code", resetCode, {
				secure: true,
				httpOnly: true,
				sameSite: "strict",
				expires: Date.now() + 1 * 60 * 60 * 1000,
			});
			return {
				isSuccess: true,
				isFailure: false,
				message: "Code de réinitialisation vérifié avec succès",
			};
		} else {
			throw new Error();
		}
	} catch (err) {
		if (err?.response?.status === 404) {
			return {
				isFailure: true,
				isSuccess: false,
				message: "Le code fourni est expiré ou invalide",
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
