const CronJob = require("cron").CronJob;
const PostModel = require("../models/Post.model");
const axios = require("axios");
const moment = require("moment");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const {
	refreshTokens,
	getUserInfo,
} = require("./helpers/twitter_api/twitterApi");
const { errorsHandler } = require("./errors/errors");

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
	"0 */90 * * * *", // runs every 1h30
	// Generating new access tokens for social media
	function () {
		const date = moment();
		SocialMediaTokenModel.find()
			.then((tokens) => {
				tokens.map(async (token) => {
					const twitterExpireTime = token.twitter.accessTokenExpireAt;
					// Twitter
					if (date.isSameOrAfter(moment(twitterExpireTime))) {
						try {
							const refreshTokensData = await refreshTokens(
								token.twitter.refreshToken
							);

							const userData = await getUserInfo(
								refreshTokensData.access_token
							);

							SocialMediaTokenModel.findOneAndUpdate(
								{
									userId: token.userId,
								},
								{
									$set: {
										twitter: {
											twitterId: userData.id,
											twitterProfilPic: userData.profile_image_url,
											twitterName: userData.name,
											twitterUsername: "@" + userData.username,
											accessToken: refreshTokensData.access_token,
											accessTokenExpireAt: date.add(
												refreshTokensData.expires_in === 7200 ? "2" : "",
												"h"
											),
											refreshToken: refreshTokensData.refresh_token,
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
						} catch (err) {
							const errorMsg = errorsHandler(err);
							console.log(errorMsg);
						}
					}
				});
			})
			.catch((err) => console.log(err));
	},
	null,
	true,
	"Europe/Madrid"
);
