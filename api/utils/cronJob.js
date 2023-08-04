const CronJob = require("cron").CronJob;
const PostModel = require("../models/Post.model");
const axios = require("axios");
const moment = require("moment");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const job = new CronJob(
	"* * * * *",
	// Every minute cron will call this function
	function () {
		PostModel.find()
			.then((posts) => {
				// Map through all posts
				posts.map((post) => {
					// Getting the scheduledSendTime
					const scheduledSendTime = moment(post.scheduledSendTime);
					// Getting the current time
					const currentMoment = moment();

					if (
						currentMoment.isAfter(scheduledSendTime) &&
						post.status === "scheduled"
					) {
						// handling different case (social media)
						switch (post.socialMedia) {
							case "twitter":
								SocialMediaTokenModel.findOne({ userId: post.posterId })
									// Retrieves the tokens of the given user
									.then((tokens) => {
										return axios({
											method: "POST",
											url: `${process.env.TWITTER_MANAGE_TWEETS_URL}`,
											withCredentials: true,
											headers: {
												// Pass his access_token in the header
												Authorization: `Bearer ${tokens.twitter.accessToken}`,
											},
											data: {
												text: post.text,
											},
										})
											.then(() => {
												// Once the tweet has been sent, update the corresponding PostModel
												PostModel.findOneAndUpdate(
													{ text: post.text, posterId: post.posterId },
													{
														$set: {
															status: "sent",
														},
													},
													{
														new: true,
														setDefaultsOnInsert: true,
													}
												)
													.then((updated) => console.log(updated))
													.catch((err) => {
														console.log(err);
													});
											})
											.catch((err) => {
												console.log(err);
											});
									})
									.catch((err) => console.log(err));
								break;
							default:
								console.log(
									"Réseau social non pris en charge:",
									post.socialMedia
								);
								break;
						}
					}
					return;
				});
			})
			.catch((err) => console.log(err));
		console.log("You will see this message every minute");
	},
	null,
	true,
	"Europe/Madrid"
);
