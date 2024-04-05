const CommentModel = require("../../models/posts/Comment.model");
const UserModel = require("../../models/users/User.model");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const PostModel = require("../../models/posts/Post.model");
const RepostModel = require("../../models/posts/Repost.model");
const AnswerModel = require("../../models/posts/Answer.model");
const {
	filterElements,
	filterElement,
} = require("../../helpers/filterResponse");

exports.saveComment = async (req, res, next) => {
	try {
		const { postId, repostId, text } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user answer)
		const medias = req.files["media"];

		if (!text || !userId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
			// Missing parameters
		}

		if (!postId && !repostId) {
			return res.status(400).send({
				error: true,
				message:
					"Le commentaire doit être lié à au moins un élément (publications, reposts)",
			});
		}

		if (postId && repostId) {
			return res.status(400).send({
				error: true,
				message:
					"Le commentaire ne peut être lié à deux éléments à la fois (publications, reposts)",
			});
		}

		// Get the post where the user wants to comment
		if (postId) {
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
		}

		if (repostId) {
			const repost = await RepostModel.findById({ _id: repostId });

			// Checks if exist
			if (!repost) {
				return res.status(404).send({
					error: true,
					message:
						"Impossible d'ajouter un commentaire à une publication inexistante",
				});
				// Cannot add a comment to a post who doesn't exist
			}
		}

		const uploadResponse = await uploadFiles(medias, "comment");

		const comment = new CommentModel({
			postId: postId,
			repostId: repostId,
			commenterId: userId, // Use the userId query as commenterId
			text: text,
			media: medias ? uploadResponse : [],
		});

		comment
			.save()
			.then(async (comment) => {
				// Always increments 1 to commentsLength on the corresponding Post
				if (comment.postId) {
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
				}
				if (comment.repostId) {
					await RepostModel.findByIdAndUpdate(
						{ _id: repostId },
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
				}

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
	const authUser = res.locals.user;
	const { postId } = req.query;

	if (!postId) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
	}

	CommentModel.find({ postId: postId })
		.populate(
			"commenterId",
			"userName lastName firstName picture blockedUsers isPrivate followers"
		)
		.exec()
		.then(async (comments) => {
			const filteredComments = await filterElements(
				comments,
				"commenterId",
				authUser
			);

			if (filteredComments.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun commentaire trouvé" });
			}

			res.status(200).send(filteredComments);
		})
		.catch((err) => res.status(500).send(err.message));
};

exports.getComment = (req, res, next) => {
	const authUser = res.locals.user;

	CommentModel.findById({ _id: req.params.id })
		.populate(
			"commenterId",
			"userName lastName firstName picture blockedUsers isPrivate followers"
		)
		.exec()
		.then(async (comment) => {
			if (!comment) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun commentaire trouvé" });
			}

			const filteredComment = await filterElement(
				comment,
				"commenterId",
				authUser
			);

			if (filteredComment.error) {
				return res.status(403).send(filteredComment);
			}

			return res.status(200).send(filteredComment);
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
			await PostModel.findOneAndUpdate(
				{ _id: comment.postId },
				{
					$inc: {
						commentsLength: -1,
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			);
			await RepostModel.findOneAndUpdate(
				{ _id: comment.repostId },
				{
					$inc: {
						commentsLength: -1,
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			);

			return res.status(200).send(comment);
		})
		.catch((err) =>
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			})
		);
};

// Reactions controllers
function checkIfReacted(post, userId) {
	let hasReacted;

	// Set the variable hasReacted value where it returns true
	if (post.reactions.love.includes(userId)) {
		hasReacted = "love";
	} else if (post.reactions.funny.includes(userId)) {
		hasReacted = "funny";
	} else if (post.reactions.surprised.includes(userId)) {
		hasReacted = "surprised";
	} else if (post.reactions.sad.includes(userId)) {
		hasReacted = "sad";
	}

	return hasReacted;
}

exports.addReaction = async (req, res, next) => {
	try {
		const { reaction } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user reaction)
		const allowedReactions = ["love", "funny", "surprised", "sad"];

		// Checks if the given reaction is in the allowedReactions array
		if (!allowedReactions.includes(reaction)) {
			return res
				.status(400)
				.send({ error: true, message: "La réaction fournit est invalide" });
			// The given reaction is not valid
		}

		// Fetch the specified comment
		const comment = await CommentModel.findById({ _id: req.params.id });

		if (!comment) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible d'ajouter une réaction à un commentaire inexistante",
				// Cannot add a reaction to a comment who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(comment, userId);

		// If the user already reacted
		if (lastUserReact) {
			if (lastUserReact === reaction) {
				return res.status(401).send({
					error: true,
					message: "Impossible d'ajouter la même réaction",
					// Cannot add the same reaction
				});
			}

			const updatedComment = await CommentModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$pull: {
						[`reactions.${lastUserReact}`]: userId, // Pull the old reaction
					},
					$addToSet: {
						[`reactions.${reaction}`]: userId, // Add the new one
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(updatedComment);
		}

		// If the user has not already voted
		const updatedComment = await CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId, // Add the reaction in the corresponding reaction
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$addToSet: {
					likes: req.params.id, // Add the answer id in the user likes array
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		return res.status(200).send(updatedComment);
	} catch (err) {
		res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.deleteReaction = async (req, res, next) => {
	try {
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user reaction)

		// Fetch the specified comment
		const comment = await CommentModel.findById({ _id: req.params.id });

		if (!comment) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de supprimer la réaction d'une publication inexistante",
				// Cannot delete a reaction from a comment who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(comment, userId);

		if (!lastUserReact) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer une réaction inexistante",
				// Cannot delete a reaction who doesn't exist
			});
		}

		const updatedComment = await CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					[`reactions.${lastUserReact}`]: userId,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$pull: {
					likes: req.params.id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		return res.status(200).send(updatedComment);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
