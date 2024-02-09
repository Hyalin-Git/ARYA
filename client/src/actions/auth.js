"use server";
import axios from "axios";
export async function createUser(formData) {
	console.log(formData);
}

export async function logIn(formData) {
	axios({
		method: "post",
		url: "http://localhost:5000/api/auth/signIn",
		withCredentials: true,
		data: {
			email: formData.get("email"),
			password: formData.get("password"),
		},
	})
		.then((res) => console.log(res))
		.catch((err) => console.log(err));
}
