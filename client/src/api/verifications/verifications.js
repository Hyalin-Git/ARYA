"use server";

import axios from "axios";

export async function verifyEmail(id, token) {
	try {
		const res = await axios({
			method: "PUT",
			url: `${process.env.API_URI}/api/verification/${id}/verify/${token}`,
			withCredentials: true,
		});

		return res.data;
	} catch (err) {
		const message = err?.response?.data?.message;
		throw new Error(message || "Une erreur est survenue");
	}
}

export async function verifyNewEmail(id, token) {
	try {
		const res = await axios({
			method: "PUT",
			url: `${process.env.API_URI}/api/verification/${id}/new-email-verify/${token}`,
			withCredentials: true,
		});

		return res.data;
		console.log(res.data);
	} catch (err) {
		console.log(err);
		const message = err?.response?.data?.message;
		throw new Error(message || "Une erreur est survenue");
	}
}
