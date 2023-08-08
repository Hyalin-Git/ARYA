const CronJob = require("cron").CronJob;
const PostModel = require("../models/Post.model");
const axios = require("axios");
const moment = require("moment");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const { OAuthTokensHandler } = require("../middlewares/OAuth.middleware");

async function sendScheduledPost(tokens, post) {
	try {
		await axios({
			method: "POST",
			url: `${process.env.TWITTER_MANAGE_TWEETS_URL}`,
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${tokens.twitter.accessToken}`,
			},
			data: {
				text: post.text,
			},
		});
		// Once the tweet has been sent, update the corresponding PostModel
		await PostModel.findOneAndUpdate(
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
		);
	} catch (err) {
		console.log(err);
	}
}

const job = new CronJob(
	"* * * * *",
	// Every minute cron will call this function
	async function () {
		PostModel.find()
			.then((posts) => {
				// Map through all posts
				posts.map((post) => {
					const scheduledSendTime = moment(post.scheduledSendTime); // Getting the scheduledSendTime
					const currentMoment = moment(); // Getting the current time

					if (
						currentMoment.isSameOrAfter(scheduledSendTime) &&
						post.status === "scheduled"
					) {
						// handling different case (social media)
						switch (post.socialMedia) {
							case "twitter":
								SocialMediaTokenModel.findOne({ userId: post.posterId })
									// Retrieves the tokens of the given user
									.then((tokens) => {
										sendScheduledPost(tokens, post);
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
	},
	null,
	true,
	"Europe/Madrid"
);

new CronJob(
	"30 */1 * * *", // runs every 1h30
	// Generating new access tokens for social media
	function () {
		const date = moment();
		SocialMediaTokenModel.find()
			.then((tokens) => {
				tokens.map((token) => {
					const twitterExpireTime = token.twitter.expireTime;
					// Twitter
					if (date.isSameOrAfter(moment(twitterExpireTime))) {
						axios({
							method: "POST",
							url: `${process.env.TWITTER_URL}/token`,
							withCredentials: true,
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
							data: {
								refresh_token: `${token.twitter.refreshToken}`,
								grant_type: "refresh_token",
								client_id: `${process.env.TWITTER_CLIENT_ID}`,
							},
						})
							.then((data) => {
								SocialMediaTokenModel.findOneAndUpdate(
									{
										userId: token.userId,
									},
									{
										$set: {
											twitter: {
												accessToken: data.data.access_token,
												expireTime: date.add(
													data.data.expires_in === 7200 ? "2" : "",
													"h"
												),
												refreshToken: data.data.refresh_token,
											},
										},
									},
									{
										new: true,
										setDefaultsOnInsert: true,
									}
								)
									.then((update) => console.log(update))
									.catch((err) => console.log(err));
							})
							.catch((err) => console.log(err));
					}
				});
			})
			.catch((err) => console.log(err));
	},
	null,
	true,
	"Europe/Madrid"
);
