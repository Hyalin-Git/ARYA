"use server";

export async function saveReportPost() {
	try {
		const res = await fetch(
			`http://localhost:5000/api/post/report?userId=${uid}`,
			{
				method: "POST",
				credentials: "include",
			}
		);

		const data = await res.json();
	} catch (err) {
		console.log(err);
	}
}
