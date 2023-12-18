const CommentModel = require("../../models/posts/Comment.model");
const UserModel = require("../../models/users/User.model");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const PostModel = require("../../models/posts/Post.model");
const AnswerModel = require("../../models/posts/Answer.model");

exports.saveComment = async (req, res, next) => {
	try {
		const { postId, text } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user answer)
		const medias = req.files["media"];

		if (!postId || !text || !userId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
			// Missing parameters
		}

		// Get the post where the user wants to comment
		const post = await PostModel.findById({ _id: postId });

		// Checks if exist
		if (!post) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible d'ajouter un commentaire à une publication inexistante",
			});
			// Cannot add a comment to a post who doesn't exist
		}

		const uploadResponse = await uploadFiles(medias, "comment");

		const comment = new CommentModel({
			postId: postId,
			commenterId: userId, // Use the userId query as commenterId
			text: text,
			media: medias ? uploadResponse : [],
		});

		comment
			.save()
			.then(async (comment) => {
				// Always increments 1 to commentsLength on the corresponding Post
				await PostModel.findByIdAndUpdate(
					{ _id: postId },
					{
						$inc: {
							commentsLength: 1,
						},
					},
					{
						setDefaultsOnInsert: true,
						new: true,
					}
				);

				return res.status(201).send(comment);
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getComments = async (req, res, next) => {
	const { postId } = req.query;
	const authUser = res.locals.user;

	if (!postId) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
	}

	CommentModel.find({
		commenterId: { $nin: authUser.blockedUsers },
		postId: postId,
	})
		.populate("commenterId", "userName lastName firstName")
		.exec()
		.then((comment) => {
			if (comment.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun commentaire trouvé" });
			}
			res.status(200).send(comment);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getComment = (req, res, next) => {
	const authUser = res.locals.user;

	CommentModel.findById({ _id: req.params.id })
		.populate("commenterId", "userName lastName firstName")
		.exec()
		.then(async (comment) => {
			if (!comment) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun commentaire trouvé" });
			}

			if (authUser) {
				const user = await UserModel.findById({ _id: comment.commenterId._id });

				if (user.blockedUsers.includes(authUser._id)) {
					return res.status(403).send({
						error: true,
						message:
							"Impossible de récupérer la publication d'un utilisateur qui vous a bloqué",
					});
				}

				if (authUser.blockedUsers.includes(comment.commenterId._id)) {
					return res.status(403).send({
						error: true,
						message:
							"Impossible de récupérer la publication d'un utilisateur que vous avez bloqué",
					});
				}
			}

			return res.status(200).send(comment);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateComment = (req, res, next) => {
	const { text } = req.body;
	const medias = req.files["media"];

	if (!text) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
	}

	CommentModel.findOne({ _id: req.params.id, commenterId: req.query.userId }) // Gets the userId from the query (Helps to verify if it's the user answer)
		.then(async (comment) => {
			if (!comment) {
				return res.status(404).send({
					error: true,
					message: "Aucun commentaire trouvé",
				});
			}

			// If the comment has medias then we delete them
			if (comment.media.length > 0) {
				await destroyFiles(comment, "comment"); // Delete all files from Cloudinary
			}

			const uploadResponse = await uploadFiles(medias, "comment");

			const updatedComment = await CommentModel.findOneAndUpdate(
				{ _id: req.params.id, commenterId: req.query.userId }, // Gets the userId from the query (Helps to verify if it's the user answer)
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

			return res.status(200).send(updatedComment);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteComment = (req, res, next) => {
	CommentModel.findOneAndDelete({
		_id: req.params.id,
		commenterId: req.query.userId, // Gets the userId from the query (Helps to verify if it's the user answer)
	})
		.then(async (comment) => {
			if (!comment) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un commentaire qui n'existe pas",
				});
			}

			// If the comment has medias then we delete them
			if (comment.media.length > 0) {
				await destroyFiles(comment, "comment"); // Delete all files from Cloudinary
			}

			// Get every nested answers of the specified comment
			const answers = await AnswerModel.find({ commentId: req.params.id });

			// For every answers we check if they got medias
			for (const answer of answers) {
				// If yes we delete them
				if (answer.media.length > 0) {
					await destroyFiles(answer, "answer");
				}
			}

			// And then we deleted every nested answers
			await AnswerModel.deleteMany({ commentId: req.params.id });

			return res.status(200).send(comment);
		})
		.catch((err) =>
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			})
		);
};

const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReaction = (req, res, next) => {
	const { reaction, userId } = req.body;

	// this function adds user reaction to the specified comment
	function setReaction(reaction) {
		CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((comment) => {
				if (!comment) {
					return res.status(404).send("Could not find a matching comment");
				}
				return res.status(200).send(comment);
			})
			.catch((err) => res.status(500).send(err));
	}

	CommentModel.findById({ _id: req.params.id })
		.then((comment) => {
			// This condition is checking in every reaction array if it includes the userId
			if (
				reactionsArray.some((reaction) =>
					comment.reactions[reaction].includes(userId)
				)
			) {
				return res
					.status(401)
					.send({ error: true, message: "Cet utilisateur a déjà réagit" }); // This user already reacted
			}

			// Checking if the user exist
			UserModel.findById({ _id: userId })
				.then((user) => {
					if (!user) {
						return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
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
								message: "Aucune réaction n'a été sélectionné", // No reaction has been selected
							});
							break;
					}
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteReaction = (req, res, next) => {
	const { userId } = req.body;

	// This function removes user reaction to the specified comment
	function delReaction(reaction) {
		CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((comment) => {
				if (!comment) {
					return res.status(404).send("Could not find a matching comment");
				}
				return res.status(200).send(comment);
			})
			.catch((err) => res.status(500).send(err));
	}

	CommentModel.findById({ _id: req.params.id })
		.then((comment) => {
			if (comment.reactions.like.includes(userId)) {
				return delReaction("like");
			}
			if (comment.reactions.awesome.includes(userId)) {
				return delReaction("awesome");
			}
			if (comment.reactions.funny.includes(userId)) {
				return delReaction("funny");
			}
			if (comment.reactions.love.includes(userId)) {
				return delReaction("love");
			} else {
				return res.status(404).send({
					error: true,
					message: "Cet utilisateur n'a pas réagit à ce commentaire",
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};
