const PostModel = require("../models/Post.model");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const moment = require("moment");
const { sendTwitterPost } = require("../services/twitter.services");

exports.sendPost = (req, res, next) => {
	SocialMediaTokenModel.findOne({ userId: req.body.userId })
		.then(async (tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte", // Twitter account not linked to this account
				});
			}

			await sendTwitterPost(tokens.twitter.accessToken, req.body.text);

			// Creates a new post if the tweet has been sent
			new PostModel({
				posterId: req.body.userId,
				socialMedia: "twitter",
				text: req.body.text,
				status: "sent",
			})
				.save()
				.then((post) =>
					res
						.status(201)
						.send({ error: false, message: "Tweet envoyé", post: post })
				)
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) =>
			res.status(parseInt(err.message.split(" ")[5]) || 500).send(err)
		);
};

exports.sendScheduledPost = (req, res, next) => {
	let date = moment();

	date
		.add(req.body.days ? req.body.day : "", "d")
		.add(req.body.hours ? req.body.hours : "", "h")
		.add(req.body.minutes ? req.body.minutes : "", "m");

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
			res.status(201).send({
				error: false,
				message: "Poste programmé enregistré",
				data: post,
			});
		})
		.catch((err) => res.status(500).send(err));
};
