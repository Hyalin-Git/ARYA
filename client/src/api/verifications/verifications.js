"use server";

import axios from "axios";

export async function verifyEmail(id, token) {
	try {
		const res = await axios({
			method: "PUT",
			url: `http://localhost:5000/api/verification/${id}/verify/${token}`,
			withCredentials: true,
		});

		return res.data;
	} catch (err) {
		const message = err?.response?.data?.message;
		throw new Error(message || "Une erreur est survenue");
	}
}