const PostModel = require("../models/Post.model");
const UserModel = require("../models/user.model");
const moment = require("moment");
const { uploadFiles, destroyFiles } = require("../helpers/cloudinaryManager");

exports.sendPost = async (req, res, next) => {
	let date = moment();
	let medias = req.files["media"];

	date
		.add(req.body.days ? req.body.days : "", "d")
		.add(req.body.hours ? req.body.hours : "", "h")
		.add(req.body.minutes ? req.body.minutes : "", "m");

	const isScheduled = req.body.days || req.body.hours || req.body.minutes;

	let uploadResponse = await uploadFiles(medias, "post");

	const post = new PostModel({
		posterId: req.body.posterId,
		text: req.body.text,
		media: uploadResponse,
		scheduledSendTime: date.format(),
		status: isScheduled ? "scheduled" : "sent",
	});
	post
		.save()
		.then((post) => res.status(201).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getPost = (req, res, next) => {
	PostModel.findById({ _id: req.params.id })
		.populate("comments.commenterId", "userName lastName firstName")
		.exec()
		.then((post) => res.status(200).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getPosts = (req, res, next) => {
	PostModel.find()
		.populate("comments.commenterId", "userName lastName firstName")
		.exec()
		.then((post) => res.status(200).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.updatePost = (req, res, next) => {
	PostModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				text: req.body.text,
			},
		},
		{
			setDefaultsOnInsert: true,
			new: true,
		}
	)
		.then((post) => {
			if (!post) {
				return res.status(404).send("Post does not exist"); // This user does not exist
			}
			res.status(200).send(post);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deletePost = (req, res, next) => {
	PostModel.findById({ _id: req.params.id })
		.then(async (post) => {
			if (!post) {
				return res.status(404).send("Post does not exist"); // This user does not exist
			}
			await destroyFiles(post, "post"); // Delete all files from Cloudinary
			await PostModel.findByIdAndDelete({ _id: req.params.id }); // Then delete the post

			return res.status(200).send(post);
		})
		.catch((err) => res.status(500).send(err.message ? err.message : err));
};

// Reactions controllers
const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReaction = (req, res, next) => {
	const { reaction, userId } = req.body;

	// this function adds user reaction to the specified post
	function setReaction(reaction) {
		PostModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((post) => {
				if (!post) {
					return res.status(404).send("Post does not exist"); // This user does not exist
				}
				return res.status(200).send(post);
			})
			.catch((err) => res.status(500).send(err));
	}

	PostModel.findById({ _id: req.params.id })
		.then((post) => {
			// This condition is checking in every reaction array if it includes the userId
			if (
				reactionsArray.some((reaction) =>
					post.reactions[reaction].includes(userId)
				)
			) {
				return res
					.status(401)
					.send({ error: true, message: "User already reacted" });
			}

			UserModel.findByIdAndUpdate(
				{ _id: req.body.userId },
				{
					$addToSet: {
						likes: req.params.id,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			)
				.then((user) => {
					if (!user) {
						return res.status(404).send("User does not exist"); // This user does not exist
					}
					switch (reaction) {
						case "like":
							setReaction("like");
							break;
						case "awesome":
							setReaction("awesome");
							break;
						case "funny":
							setReaction("funny");
							break;
						case "love":
							setReaction("love");
							break;
						default:
							res.status(400).send({
								error: true,
								message: "Aucune réaction n'a été sélectionné",
							});
							break;
					}
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteReaction = async (req, res, next) => {
	const { userId } = req.body;

	function delReaction(reaction) {
		PostModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((post) => {
				if (!post) {
					return res.status(404).send("Post does not exist"); // This user does not exist
				}
				return res.status(200).send(post);
			})
			.catch((err) => res.status(500).send(err));
	}

	PostModel.findById({ _id: req.params.id })
		.then((post) => {
			UserModel.findByIdAndUpdate(
				{ _id: userId },
				{
					$pull: {
						likes: post._id,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			)
				.then((user) => {
					if (!user) {
						return res.status(404).send("User does not exist"); // This user does not exist
					} else {
						if (post.reactions.like.includes(userId)) {
							return delReaction("like");
						}
						if (post.reactions.awesome.includes(userId)) {
							return delReaction("awesome");
						}
						if (post.reactions.funny.includes(userId)) {
							return delReaction("funny");
						}
						if (post.reactions.love.includes(userId)) {
							return delReaction("love");
						} else {
							return res.status(404).send({
								error: true,
								message: "User didn't react to any of these posts",
							});
						}
					}
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
