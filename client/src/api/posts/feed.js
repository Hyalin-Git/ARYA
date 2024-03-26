import axios from "axios";
import { cookies } from "next/headers";

export async function getFeed() {
	try {
		const res = await axios({
			method: "GET",
			url: `http://localhost:5000/api/feed`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${cookies().get("session")?.value}`,
			},
		});

		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}
