const PostModel = require("../../models/posts/Post.model");
const UserModel = require("../../models/users/User.model");
const moment = require("moment");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const CommentModel = require("../../models/posts/Comment.model");
const AnswerModel = require("../../models/posts/Answer.model");

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
		media: medias ? uploadResponse : [],
		scheduledSendTime: date.format(),
		status: isScheduled ? "scheduled" : "sent",
	});
	post
		.save()
		.then((post) => res.status(201).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getPosts = (req, res, next) => {
	const authUser = res.locals.user;
	// If the authUserId does not appear in any user blocked Array
	// Then just get posts where posterId is not in authUser blocked array (can be empty).
	PostModel.find({
		posterId: { $nin: authUser.blockedUsers },
	})
		.populate("posterId", "userName lastName firstName")
		.exec()
		.then((posts) => {
			if (posts.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}
			return res.status(200).send(posts);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getPost = (req, res, next) => {
	const authUser = res.locals.user;
	PostModel.findById({ _id: req.params.id })
		.populate("posterId", "userName lastName firstName")
		.exec()
		.then(async (post) => {
			if (!post) {
				return res.status(404).send({
					error: true,
					message: "Cette publication n'existe pas",
				});
			}
			const user = await UserModel.findById({ _id: post.posterId._id });

			if (user.blockedUsers.includes(authUser._id)) {
				return res.status(403).send({
					error: true,
					message:
						"Impossible de récupérer la publication d'un utilisateur qui vous a bloqué",
				});
			}
			if (authUser.blockedUsers.includes(post.posterId._id)) {
				return res.status(403).send({
					error: true,
					message:
						"Impossible de récupérer la publication d'un utilisateur que vous avez bloqué",
				});
			}

			return res.status(200).send(post);
		})
		.catch((err) => res.status(500).send(err.message));
};

exports.updatePost = async (req, res, next) => {
	let medias = req.files["media"];

	PostModel.findById({ _id: req.params.id, posterId: req.query.userId })
		.then(async (post) => {
			if (!post) {
				return res.status(404).send("Post does not exist"); // This user does not exist
			}

			if (post.media.length > 0) {
				await destroyFiles(post, "post"); // Destroy files only if there is medias
			}

			const uploadResponse = await uploadFiles(medias, "post");
			const updatePost = await PostModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						text: req.body.text,
						media: medias ? uploadResponse : [],
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			);
			return res.status(200).send(updatePost);
		})
		.catch((err) => res.status(500).send(err.message ? err.message : err));
};

exports.deletePost = (req, res, next) => {
	PostModel.findById({ _id: req.params.id })
		.then(async (post) => {
			if (!post) {
				return res.status(404).send("Post does not exist"); // This user does not exist
			}
			if (post.media.length > 0) {
				await destroyFiles(post, "post"); // Delete all files from Cloudinary
			}
			await PostModel.findByIdAndDelete({ _id: req.params.id }); // Then delete the post
			await CommentModel.deleteMany({ postId: req.params.id });
			await AnswerModel.deleteMany({ commentId: req.params.id });

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
