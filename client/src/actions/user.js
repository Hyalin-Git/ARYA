"use server";
import { regex } from "@/libs/regex";
import {
	UpdateUserSchema,
	UpdateUserSocialSchema,
	UpdateUserToolsSchema,
} from "@/libs/utils";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "../libs/zodConfig";

export async function updateUserPicture(uid, prevState, formData) {
	try {
		const dataToSend = new FormData();
		dataToSend.append("picture", formData.get("picture"));

		console.log(formData.get("picture"));

		const res = await fetch(
			`${process.env.API_URI}/api/users/update-picture/${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
				},
				body: dataToSend,
			}
		);
		const data = await res.json();
		console.log(data);
		revalidateTag("user");
		return {
			status: "success",
		};
	} catch (err) {
		console.log(err);
	}
}

export async function updateUser(uid, prevState, formData) {
	try {
		const parsedData = UpdateUserSchema.safeParse({
			lastName: formData.get("lastName"),
			firstName: formData.get("firstName"),
			userName: formData.get("userName"),
			job: formData.get("job"),
			biographie: formData.get("biographie"),
			contact: formData.get("contact"),
			website: formData.get("website"),
		});

		if (!parsedData.success) {
			const error = parsedData.error.flatten().fieldErrors;
			console.log(error);
			if (error.lastName) {
				throw new Error("Veuillez saisir un nom valide");
			}
			if (error.firstName) {
				throw new Error("Veuillez saisir un prénom valide");
			}
			if (error.userName) {
				throw new Error("Veuillez saisir un nom d'utilisateur valide");
			}
			if (error.job) {
				throw new Error("Veuillez saisir une profession valide");
			}
			if (error.biographie) {
				throw new Error(
					"Veuillez saisir une biographie valide comprise entre 0 et 500 caratères"
				);
			}
			if (error.contact) {
				throw new Error("Veuillez saisir une adresse mail de contact valide");
			}
			if (error.website) {
				throw new Error("Veuillez saisir une URL valide");
			}
		}

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
			`${process.env.API_URI}/api/users/update-user/${uid}`,
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
		revalidateTag("user");
		return {
			status: "success",
			message: "Modifications enregistrées avec succès",
		};
	} catch (err) {
		if (
			err.message.includes("nom") &&
			!err.message.includes("prénom") &&
			!err.message.includes("nom d'utilisateur")
		) {
			return {
				message: err.message,
				error: ["lastName"],
			};
		}
		if (err.message.includes("prénom")) {
			return {
				message: err.message,
				error: ["firstName"],
			};
		}
		if (err.message.includes("nom d'utilisateur")) {
			return {
				message: err.message,
				error: ["userName"],
			};
		}
		if (err.message.includes("profession")) {
			return {
				message: err.message,
				error: ["job"],
			};
		}
		if (err.message.includes("biographie")) {
			return {
				message: err.message,
				error: ["biographie"],
			};
		}
		if (err.message.includes("contact")) {
			return {
				message: err.message,
				error: ["contact"],
			};
		}
		if (err.message.includes("URL")) {
			return {
				message: err.message,
				error: ["website"],
			};
		}
		return {
			status: "failure",
			message:
				"Une erreur s'est produite de notre côté, veuillez réessayer ultérieurement",
		};
	}
}

export async function updateUserSocial(uid, prevState, formData) {
	try {
		const parsedData = UpdateUserSocialSchema.safeParse({
			x: formData.get("twitter"),
			tiktok: formData.get("tiktok"),
			instagram: formData.get("instagram"),
			facebook: formData.get("facebook"),
			linkedIn: formData.get("linkedIn"),
			youtube: formData.get("youtube"),
			twitch: formData.get("twitch"),
		});

		if (!parsedData.success) {
			const error = parsedData.error.flatten().fieldErrors;

			if (error.x) {
				throw new Error("Veuillez saisir une URL valide vers votre profil x");
			}
			if (error.tiktok) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre profil tiktok"
				);
			}
			if (error.instagram) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre profil instagram"
				);
			}
			if (error.facebook) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre profil facebook"
				);
			}
			if (error.linkedIn) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre profil linkedIn"
				);
			}
			if (error.youtube) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre chaine youtube"
				);
			}
			if (error.twitch) {
				throw new Error(
					"Veuillez saisir une URL valide vers votre chaine twitch"
				);
			}
		}

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
			`${process.env.API_URI}/api/users/update-social/${uid}`,
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
		revalidateTag("user");
		return {
			status: "success",
			message: "Modifications enregistrées avec succès",
		};
	} catch (err) {
		const errors = [
			"x",
			"tiktok",
			"instagram",
			"facebook",
			"linkedIn",
			"youtube",
			"twitch",
		];
		for (const error of errors) {
			if (err?.message?.includes(error)) {
				return {
					message: err?.message,
					error: [error],
				};
			}
		}
		return {
			status: "failure",
			message:
				"Une erreur s'est produite de notre côté, veuillez réessayer ultérieurement",
		};
	}
}

export async function updateUserTools(uid, tools, prevState, formData) {
	try {
		let array;

		if (formData) {
			if (formData.get("tool").length <= 0) {
				array = [...tools];
			} else {
				array = [...tools, formData.get("tool")];
			}
		} else {
			array = [...tools];
		}

		const parsedData = UpdateUserToolsSchema.safeParse({
			tools: array,
		});
		if (!parsedData.success) {
			const error = parsedData.error.flatten().fieldErrors;
			if (error.tools) {
				console.log(error.tools[0]);
				const message = !error?.tools[0].includes("expression")
					? error?.tools[0]
					: "Veuillez saisir un outil valide";
				throw new Error(message);
			}
		}
		const toolsData = {
			tools: array,
		};
		const res = await fetch(
			`${process.env.API_URI}/api/users/update-tools/${uid}`,
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
		revalidateTag("user");
		return {
			status: "success",
			data: data.tools,
		};
	} catch (err) {
		const keywords = ["caractère", "outil"];
		for (const keyword of keywords) {
			if (err?.message?.includes(keyword)) {
				return {
					status: "failure",
					message: err?.message,
					error: ["tools"],
				};
			}
		}
		return {
			status: "failure",
			message:
				"Une erreur s'est produite de notre côté, veuillez réessayer ultérieurement",
		};
	}
}

// EMAIL LOGIC

const updateEmail = z.object({
	password: z.string().min(8).regex(regex.password.pass),
	newEmail: z.string().min(3).regex(regex.email),
});

export async function sendEmailResetLink(uid, prevState, formData) {
	try {
		const parsedData = updateEmail.safeParse({
			password: formData.get("password"),
			newEmail: formData.get("newEmail"),
		});

		if (!parsedData.success) {
			const error = parsedData.error.flatten().fieldErrors;
			console.log(error);

			if (error.password) {
				return {
					message:
						"Votre mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule, une minuscule et un caratère spécial",
					error: ["password"],
				};
			}
			if (error.newEmail) {
				return {
					message: "L'adresse mail renseigné n'est pas valide",
					error: ["newEmail"],
				};
			}
		}
		const dataToSend = {
			password: formData.get("password"),
			newEmail: formData.get("newEmail"),
		};
		const res = await fetch(
			`${process.env.API_URI}/api/users/email-reset/${uid}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			}
		);

		const data = await res.json();

		if (res.status === 201) {
			return {
				status: "success",
				message: data?.message,
			};
		} else {
			throw new Error(data.message);
		}
	} catch (err) {
		console.log(err);
		if (err?.message?.includes("mot de passe")) {
			return {
				message: err.message,
				error: "password",
			};
		}
		if (err?.message?.includes("différente")) {
			return {
				message: err.message,
				error: "newEmail",
			};
		}
		if (err?.message?.includes("déjà utilisé")) {
			return {
				message: err.message,
				error: "newEmail",
			};
		}
		return {
			status: "failure",
			message:
				"Quelque chose s'est mal passé de notre côté veuillez réessayer ultérieurement...",
		};
	}
}

// PASSWORDS LOGIC

const UpdatePassword = z.object({
	password: z.string().min(8).regex(regex.password.pass),
	newPassword: z.string().min(8).regex(regex.password.pass),
	confirmNewPassword: z.string().min(8).regex(regex.password.pass),
});

export async function updateUserPassword(uid, prevState, formData) {
	try {
		const passData = UpdatePassword.safeParse({
			password: formData.get("password"),
			newPassword: formData.get("newPassword"),
			confirmNewPassword: formData.get("confirmNewPassword"),
		});
		if (!passData.success) {
			const error = passData.error.flatten().fieldErrors;
			const inputError =
				(error.password && "password") ||
				(error.newPassword && "newPassword") ||
				(error?.confirmNewPassword && "confirmNewPassword");

			return {
				message:
					"Votre mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule, une minuscule et un caratère spécial",
				error: [inputError],
			};
		}
		if (formData.get("confirmNewPassword") !== formData.get("newPassword")) {
			return {
				message: "Les mots de passe ne correspondent pas",
			};
		}

		const dataToSend = {
			password: formData.get("password"),
			newPassword: formData.get("newPassword"),
			confirmNewPassword: formData.get("confirmNewPassword"),
		};
		const res = await fetch(
			`${process.env.API_URI}/api/users/update-password/${uid}`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			}
		);

		const data = await res.json();
		console.log(data);
		if (data?.message?.includes("actuel")) {
			return {
				message: data?.message,
				error: ["password"],
			};
		}
		if (data?.message?.includes("ancien")) {
			return {
				message: data?.message,
				error: ["newPassword"],
			};
		}

		if (res.status === 200) {
			return {
				status: "success",
				message: "Mot de passe réinitialiser avec succès",
			};
		} else {
			throw new Error("Quelque chose s'est mal passée");
		}
	} catch (err) {
		console.log(err);
	}
}

export async function updateForgotPassword(prevState, formData) {
	try {
		const res = await axios({
			method: "PUT",
			url: `${process.env.API_URI}/api/users/forgot-password`,
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

// BLOCK LOGIC
export async function blockUser(uid, prevState, formData) {
	try {
		const dataToSend = {
			idToBlock: formData.get("idToBlock"),
		};
		const response = await fetch(
			`${process.env.API_URI}/api/users/block/${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Failed to unblock user");
		}
		console.log(data);
		revalidateTag("user");
		return {
			status: "success",
			message: "aya",
		};
	} catch (err) {
		console.log("block user error:", err);
		return {
			status: "failure",
			message: "aya",
		};
	}
}
export async function unblockUser(uid, prevState, formData) {
	try {
		console.log(uid, "l'id de l'auth");
		const dataToSend = {
			idToUnblock: formData.get("idToUnblock"),
		};
		console.log(formData.get("idToUnblock"), "l'id de l'user à débloquer");
		const response = await fetch(
			`${process.env.API_URI}/api/users/unblock/${uid}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${cookies().get("session")?.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Failed to unblock user");
		}
		console.log(data);
		revalidateTag("blockedUsers");
		return {
			status: "success",
			message: "aya",
		};
	} catch (err) {
		console.log("block user error:", err);
		return {
			status: "failure",
			message: "aya",
		};
	}
}

// DELETE USER ACCOUNT
const deleteUserSchema = z.object({
	password: z.string().min(8).regex(regex.password.pass),
});

export async function deleteUserAccount(uid, prevState, formData) {
	try {
		const validation = deleteUserSchema.safeParse({
			password: formData.get("password"),
		});

		if (!validation.success) {
			const error = validation.error.flatten().fieldErrors;
			if (error.password) {
				return {
					message:
						"Votre mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule, une minuscule et un caratère spécial",
					error: ["password"],
				};
			}
		}
		const dataToSend = {
			password: formData.get("password"),
		};
		const res = await fetch(`${process.env.API_URI}/api/users/${uid}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dataToSend),
		});

		const data = await res.json();
		if (res.status !== 200) {
			throw data;
		}
	} catch (err) {
		console.log("ceci est l'erreur: " + err.message);
		if (err?.message?.includes("mot de passe actuel")) {
			return {
				message: err.message,
				error: ["password"],
			};
		}
		return {
			status: "failure",
			message:
				"Quelque chose s'est mal passé de notre côté, veuillez réessayer ultérieurment",
			error: ["password"],
		};
	}
	cookies().delete("session");
	redirect("/");
}
