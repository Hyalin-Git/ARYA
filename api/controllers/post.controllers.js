const axios = require("axios");
const moment = require("moment");
const PostModel = require("../models/Post.model");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");

exports.sendPost = (req, res, next) => {
	SocialMediaTokenModel.findOne({ userId: req.body.userId })
		.then((tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte", // Twitter account not linked to this account
				});
			}
			axios({
				method: "POST",
				url: `${process.env.TWITTER_MANAGE_TWEETS_URL}`,
				withCredentials: true,
				headers: {
					// Pass the access_token in the header
					Authorization: `Bearer ${tokens.twitter.accessToken}`,
				},
				data: {
					text: req.body.text,
				},
			})
				.then((data) => {
					// Creates a new post if the tweet has been sent
					const post = new PostModel({
						posterId: req.body.userId,
						socialMedia: "Twitter",
						text: req.body.text,
						media: req.body.media,
					});
					post
						.save()
						.then((post) => {
							res.status(201).send({
								error: false,
								message: "Tweet envoyé",
								data: data.data,
								post: post,
							});
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.sendScheduledPost = (req, res, next) => {
	let date = moment();

	// date.set({
	// 	year: req.body.year,
	// 	month: req.body.month,
	// 	date: req.body.day,
	// 	hour: req.body.hour,
	// 	minute: req.body.minute,
	// });

	date.add(2, "minute");

	const post = new PostModel({
		posterId: req.body.posterId,
		socialMedia: req.body.socialMedia,
		text: req.body.text,
		media: req.body.media,
		scheduledSendTime: date.format(),
	});
	post
		.save()
		.then((post) => {
			res.status(201).send(post);
		})
		.catch((err) => res.status(500).send(err));
};
