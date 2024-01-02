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
const { filterPosts } = require("../../helpers/filterByBlocks");

exports.savePost = async (req, res, next) => {
	const { text } = req.body;
	const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user post)
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

exports.getPosts = async (req, res, next) => {
	const authUser = res.locals.user;

	const { posterId, search, userLikes, sortByReact, sortByDate } = req.query;
	let user;

	if (userLikes) {
		user = await UserModel.findById({ _id: userLikes });
	}

	function filter() {
		const filter = { status: "sent" };

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

	PostModel.find(filter())
		.sort(sorting())
		.populate("posterId", "userName lastName firstName blockedUsers")
		.exec()
		.then(async (posts) => {
			const filteredPosts = await filterPosts(posts, authUser);

			if (filteredPosts.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}

			return res.status(200).send({ posts: filteredPosts, params: params });
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
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

// Reactions controllers
function checkIfReacted(post, userId) {
	let hasReacted;

	// Set the variable hasReacted value where it returns true
	if (post.reactions.like.includes(userId)) {
		hasReacted = "like";
	} else if (post.reactions.awesome.includes(userId)) {
		hasReacted = "awesome";
	} else if (post.reactions.love.includes(userId)) {
		hasReacted = "love";
	} else if (post.reactions.funny.includes(userId)) {
		hasReacted = "funny";
	}

	return hasReacted;
}

exports.addReaction = async (req, res, next) => {
	try {
		const { reaction } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user reaction)
		const allowedReactions = ["like", "awesome", "funny", "love"];

		// Checks if the given reaction is in the allowedReactions array
		if (!allowedReactions.includes(reaction)) {
			return res
				.status(400)
				.send({ error: true, message: "La réaction fournit est invalide" });
			// The given reaction is not valid
		}

		// Fetch the specified post
		const post = await PostModel.findById({ _id: req.params.id });

		if (!post) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible d'ajouter une réaction à une publication inexistante",
				// Cannot add a reaction to a post who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(post, userId);

		// If the user already reacted
		if (lastUserReact) {
			if (lastUserReact === reaction) {
				return res.status(401).send({
					error: true,
					message: "Impossible d'ajouter la même réaction",
					// Cannot add the same reaction
				});
			}

			const updatedPost = await PostModel.findByIdAndUpdate(
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

			return res.status(200).send(updatedPost);
		}

		// If the user has not already voted
		const updatedPost = await PostModel.findByIdAndUpdate(
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

		return res.status(200).send(updatedPost);
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

		// Fetch the specified post
		const post = await PostModel.findById({ _id: req.params.id });

		if (!post) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de supprimer la réaction d'une publication inexistante",
				// Cannot delete a reaction from a post who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(post, userId);

		if (!lastUserReact) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer une réaction inexistante",
				// Cannot delete a reaction who doesn't exist
			});
		}

		const updatedPost = await PostModel.findByIdAndUpdate(
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

		return res.status(200).send(updatedPost);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
