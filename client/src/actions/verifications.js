"use server";
import axios from "axios";
import { cookies } from "next/headers";
export async function verifyResetPasswordCode(prevState, formData) {
	try {
		const res = await axios({
			method: "PUT",
			url: "http://localhost:5000/api/verification/reset-code-verify",
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
				message: "Le code fournit est expiré ou invalide",
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
