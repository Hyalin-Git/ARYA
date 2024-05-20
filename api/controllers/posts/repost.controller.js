const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const {
	filterElements,
	filterElement,
	isPrivateRepost,
} = require("../../helpers/filterResponse");
const AnswerModel = require("../../models/posts/Answer.model");
const CommentModel = require("../../models/posts/Comment.model");
const PostModel = require("../../models/posts/Post.model");
const RepostModel = require("../../models/posts/Repost.model");
const UserModel = require("../../models/users/User.model");

exports.saveRepost = async (req, res, next) => {
	try {
		const { text, postId, repostId } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user repost)
		const medias = req.files["media"];
		let postModel;
		let repostModel;

		if (!postId && !repostId) {
			return res.status(400).send({
				error: true,
				message: "Paramètres manquants",
			});
		}
		if (postId && repostId) {
			return res.status(400).send({
				error: true,
				message: "Paramètres invalides",
			});
		}

		if (postId) {
			postModel = await PostModel.findById({ _id: postId });
		}
		if (repostId) {
			repostModel = await RepostModel.findById({ _id: repostId });
		}

		if (!postModel && !repostModel) {
			return res.status(404).send({
				error: true,
				message: "Impossible de repost une publication inexistante",
			});
		}

		const uploadResponse = await uploadFiles(medias, "repost");

		const repost = new RepostModel({
			reposterId: userId,
			text: text,
			media: medias ? uploadResponse : [],
			postId: postId,
			repostId: repostId,
		});
		repost
			.save()
			.then(async (repost) => {
				if (postModel) {
					await PostModel.findByIdAndUpdate(
						{ _id: postId },
						{
							$inc: {
								repostsLength: 1,
							},
						},
						{
							setDefaultsOnInsert: true,
							new: true,
						}
					);
				}
				if (repostModel) {
					await RepostModel.findByIdAndUpdate(
						{ _id: repostId },
						{
							$inc: {
								repostsLength: 1,
							},
						},
						{
							setDefaultsOnInsert: true,
							new: true,
						}
					);
				}

				return res.status(201).send(repost);
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getReposts = async (req, res, next) => {
	const authUser = res.locals.user;
	const { posterId, search, userLikes, sortByReact, sortByDate } = req.query;
	let user;

	if (userLikes) {
		user = await UserModel.findById({ _id: userLikes });
	}

	function filter() {
		const filter = {};

		if (posterId) {
			filter.posterId = posterId;
		}

		if (search) {
			filter.text = { $regex: search, $options: "i" };
		}

		if (userLikes) {
			filter._id = { $in: user.likes };
		}

		return filter;
	}

	function sorting() {
		if (sortByReact) {
			return {
				reactions: sortByReact,
			};
		}
		if (sortByDate) {
			return {
				createdAt: sortByDate,
			};
		}
	}

	const params = {
		posterId: posterId,
		search: search,
		sortByReact: sortByReact,
		sortByDate: sortByDate,
		userLikes: userLikes,
	};

	RepostModel.find(filter())
		.sort(sorting())
		.populate(
			"reposterId",
			"userName lastName firstName blockedUsers isPrivate followers"
		)
		.populate({
			path: "postId",
			select: "text gif media",
			populate: {
				path: "posterId",
				select: "lastName firstName userName blockedUsers isPrivate followers",
			},
		})
		.exec()
		.then(async (reposts) => {
			const filteredReposts = await filterElements(
				reposts,
				"reposterId",
				authUser
			);

			if (filteredReposts.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}

			return res.status(200).send({ reposts: filteredReposts, params: params });
		})
		.catch((err) => res.status(500).send(err.message));
};

exports.getRepost = (req, res, next) => {
	const authUser = res.locals.user;

	RepostModel.findById({ _id: req.params.id })
		.populate(
			"reposterId",
			`userName lastName firstName isPrivate ${
				authUser && "blockedUsers followers"
			}`
		)
		.populate({
			path: "postId",
			select: "text media",
			populate: {
				path: "posterId",
				select: `userName lastName firstName isPrivate ${
					authUser && "blockedUsers followers"
				}`,
			},
		})
		.exec()
		.then(async (repost) => {
			if (!repost) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}

			if (authUser) {
				const filteredRepost = await filterElement(
					repost,
					"reposterId",
					authUser
				);

				if (filteredRepost.error) {
					return res.status(403).send(filteredRepost);
				}

				return res.status(200).send(filteredRepost);
			} else {
				if (repost.reposterId.isPrivate) {
					return res.status(403).send({
						error: true,
						message:
							"Cette publication vient d'un compte privé, veuillez suivre ce compte pour voir ses publications",
					});
				}

				if (repost.postId.posterId.isPrivate) {
					repost.postId.text = undefined;
					repost.postId.media = undefined;
				}

				return res.status(200).send(repost);
			}
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.updateRepost = (req, res, next) => {
	const medias = req.files["media"];

	RepostModel.findOne({
		_id: req.params.id,
		reposterId: req.query.userId,
	})
		.then(async (repost) => {
			if (!repost) {
				return res.status(404).send({
					error: true,
					message: "Impossible de modifier une publication qui n'existe pas",
					// Cannot update a post who doesn't exist
				});
			}

			if (repost.media.length > 0) {
				await destroyFiles(repost, "repost"); // Destroy files only if there is medias
			}

			const uploadResponse = await uploadFiles(medias, "repost");

			const updatedRepost = await RepostModel.findOneAndUpdate(
				{ _id: req.params.id, reposterId: req.query.userId },
				{
					$set: {
						text: req.body.text,
						media: medias ? uploadResponse : [],
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(updatedRepost);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.deleteRepost = (req, res, next) => {
	RepostModel.findOneAndDelete({
		_id: req.params.id,
		reposterId: req.query.userId,
	})
		.then(async (repost) => {
			if (!repost) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un repost inexistant",
					// Cannot delete a repost who doesn't exist
				});
			}

			// If there is medias then delete those
			if (repost.media.length > 0) {
				await destroyFiles(repost, "repost");
			}

			// Gets every nested elements such as comments and answers
			const comments = await CommentModel.find({ repostId: req.params.id });
			const answers = await AnswerModel.find({ repostId: req.params.id });
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
			await CommentModel.deleteMany({ repostId: req.params.id });
			await AnswerModel.deleteMany({ repostId: req.params.id });
			await PostModel.findByIdAndUpdate(
				{ _id: repost.postId },
				{
					$inc: {
						repostsLength: -1,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(repost);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
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
		console.log(reaction);
		// Checks if the given reaction is in the allowedReactions array
		if (!allowedReactions.includes(reaction)) {
			return res
				.status(400)
				.send({ error: true, message: "La réaction fournit est invalide" });
			// The given reaction is not valid
		}

		// Fetch the specified repost
		const repost = await RepostModel.findById({ _id: req.params.id });

		if (!repost) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible d'ajouter une réaction à une publication inexistante",
				// Cannot add a reaction to a post who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(repost, userId);

		// If the user already reacted
		if (lastUserReact) {
			if (lastUserReact === reaction) {
				return res.status(401).send({
					error: true,
					message: "Impossible d'ajouter la même réaction",
					// Cannot add the same reaction
				});
			}

			const updatedRepost = await RepostModel.findByIdAndUpdate(
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

			return res.status(200).send(updatedRepost);
		}

		// If the user has not already voted
		const updatedRepost = await RepostModel.findByIdAndUpdate(
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
					likes: req.params.id, // Add the repost id in the user likes array
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		return res.status(200).send(updatedRepost);
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

		// Fetch the specified repost
		const repost = await RepostModel.findById({ _id: req.params.id });

		if (!repost) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de supprimer la réaction d'une publication inexistante",
				// Cannot delete a reaction from a repost who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(repost, userId);

		if (!lastUserReact) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer une réaction inexistante",
				// Cannot delete a reaction who doesn't exist
			});
		}

		const updatedRepost = await RepostModel.findByIdAndUpdate(
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

		return res.status(200).send(updatedRepost);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
