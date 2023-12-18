const PostModel = require("../../models/posts/Post.model");
const UserModel = require("../../models/users/User.model");
const moment = require("moment");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const CommentModel = require("../../models/posts/Comment.model");
const AnswerModel = require("../../models/posts/Answer.model");
const { getFormattedDates } = require("../../helpers/formattingDates");

exports.savePost = async (req, res, next) => {
	const { text } = req.body;
	const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user answer)
	const medias = req.files["media"];
	let scheduledSendTime = moment();
	const { hour, minute, day, month, year } = req.body; // Getting filled dates

	if (!text && !medias) {
		return res
			.status(400)
			.send({ error: true, message: "Une publication ne peut pas être vide" });
	}

	const sendingDateFormat = await getFormattedDates(
		scheduledSendTime,
		hour,
		minute,
		day,
		month,
		year
	);

	const isScheduled = hour || minute || day || month || year;

	const uploadResponse = await uploadFiles(medias, "post");

	const post = new PostModel({
		posterId: userId,
		text: text,
		media: medias ? uploadResponse : [],
		scheduledSendTime: sendingDateFormat,
		status: isScheduled ? "scheduled" : "sent",
	});
	post
		.save()
		.then((post) => res.status(201).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getPosts = (req, res, next) => {
	const filter = {};
	const { posterId, search } = req.query;

	if (posterId) {
		filter.posterId = posterId;
	}

	if (search) {
		filter.search = search;
	}

	PostModel.find(filter)
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
	const { text } = req.body;
	const medias = req.files["media"];

	PostModel.findById({ _id: req.params.id, posterId: req.query.userId }) // Gets the userId from the query (Helps to verify if it's the user answer)
		.then(async (post) => {
			if (!post) {
				return res
					.status(404)
					.send("Impossible de mettre à jour une publication inexistante");
				// Cannot update a post who doesn't exist
			}

			if (post.media.length > 0) {
				await destroyFiles(post, "post"); // Destroy files only if there is medias
			}

			const uploadResponse = await uploadFiles(medias, "post");

			const updatedPost = await PostModel.findOneAndUpdate(
				{ _id: req.params.id, posterId: req.query.userId }, // Gets the userId from the query (Helps to verify if it's the user answer)
				{
					$set: {
						text: text,
						media: medias ? uploadResponse : [],
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			);
			return res.status(200).send(updatedPost);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.deletePost = (req, res, next) => {
	PostModel.findOneAndDelete({ _id: req.params.id, posterId: req.query.userId }) // Gets the userId from the query (Helps to verify if it's the user answer)
		.then(async (post) => {
			if (!post) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une publication qui n'existe pas",
					// Cannot delete a post who doesn't exist
				});
			}

			// If the post has medias then delete those
			if (post.media.length > 0) {
				await destroyFiles(post, "post"); // Delete all files from Cloudinary
			}

			// Gets every nested elements such as comments and answers
			const comments = await CommentModel.find({ postId: req.params.id });
			const answers = await AnswerModel.find({ postId: req.params.id });
			// Then stock them in the const nestedElements
			const nestedElements = [...comments, ...answers];

			for (const nestedElement of nestedElements) {
				// Checks if the nestedElement has media
				if (nestedElement.media.length > 0) {
					// Then checks if it's a comment
					if (nestedElement.commenterId) {
						await destroyFiles(nestedElement, "comment"); // Delete all files from Cloudinary
					}
					// Or an answer
					if (nestedElement.answererId) {
						await destroyFiles(nestedElement, "answer"); // Delete all files from Cloudinary
					}
				}
			}

			// Then delete every nested elements such as comments and answers
			await CommentModel.deleteMany({ postId: req.params.id });
			await AnswerModel.deleteMany({ postId: req.params.id });

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
