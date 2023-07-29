const CronJob = require("cron").CronJob;
const PostModel = require("../models/Post.model");
const axios = require("axios");
const moment = require("moment");
const date = moment();
const job = new CronJob(
	"* * * * *",
	function () {
		PostModel.find()
			.then((posts) => {
				posts.map((post) => {
					// if (
					// 	post.scheduledSendTime <= date.format() &&
					// 	post.socialMedia === "twitter"
					// ) {
					// 	return axios({
					// 		method: "POST",
					// 		url: "http://localhost:5000/api/post/",
					// 		withCredentials: true,
					// 		body: {
					// 			text: post.text,
					// 		},
					// 	})
					// 		.then((data) => {
					// 			res.status(200).send(data);
					// 		})
					// 		.catch((err) => res.status(500).send(err));
					// }
				});
			})
			.catch((err) => console.log(err));
		console.log("You will see this message every second");
	},
	null,
	true,
	"Europe/Madrid"
);
