"use server";
import axios from "axios";
import { redirect } from "next/navigation";

export async function createUser(formData) {
	console.log(formData);
}

export async function logIn(prevState, formData) {
	try {
		const response = await axios({
			method: "post",
			url: "http://localhost:5000/api/auth/signIn",
			withCredentials: true,
			data: {
				email: formData.get("email"),
				password: formData.get("password"),
			},
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
