const PostModel = require("../models/Post.model");
const UserModel = require("../models/user.model");
const moment = require("moment");
const cloudinary = require("../config/cloudinary.config");

exports.sendPost = async (req, res, next) => {
	let date = moment();

	date
		.add(req.body.days ? req.body.days : "", "d")
		.add(req.body.hours ? req.body.hours : "", "h")
		.add(req.body.minutes ? req.body.minutes : "", "m");

	const isScheduled = req.body.days || req.body.hours || req.body.minutes;

	async function handleFiles() {
		let files = req.files["media"];

		let uploadFiles = files.map((medias) => {
			return new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: "image",
							folder: "Arya/post",
						},
						(error, result) => {
							if (error) {
								reject(
									res.status(500).send({
										error: true,
										message:
											"Une erreur est survenue lors du téléchargement de l'image sur Cloudinary.",
									})
								);
							} else resolve(result);
						}
					)
					.end(medias.buffer);
			});
		});

		let cloudinaryResponse = await Promise.all(uploadFiles);

		return cloudinaryResponse;
	}

	let uploadResponse = await handleFiles();

	const post = new PostModel({
		posterId: req.body.posterId,
		text: req.body.text,
		media: req.files["media"]
			? uploadResponse.map((res) => res.secure_url)
			: undefined,
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
		.then((post) => res.status(200).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getPosts = (req, res, next) => {
	PostModel.find()
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
	PostModel.findByIdAndDelete({ _id: req.params.id })
		.then((post) => {
			if (!post) {
				return res.status(404).send("Post does not exist"); // This user does not exist
			}
			res
				.status(200)
				.send({ error: false, message: "This post has been deleted" });
		})
		.catch((err) => res.status(500).send(err));
};

// Reactions controllers
const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReaction = (req, res, next) => {
	const { reaction, userId } = req.body;

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
			if (
				reactionsArray.some((reaction) =>
					post.reactions[reaction].includes(userId)
				)
			) {
				return res
					.status(401)
					.send({ error: true, message: "User already reacted" });
			} else {
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
						}
					})
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.removeReaction = async (req, res, next) => {
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
