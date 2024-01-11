const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const {
	filterElements,
	filterElement,
} = require("../../helpers/filterResponse");
const AnswerModel = require("../../models/posts/Answer.model");
const CommentModel = require("../../models/posts/Comment.model");
const UserModel = require("../../models/users/User.model");

exports.saveAnswer = async (req, res, next) => {
	try {
		const { commentId, parentAnswerId, text } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user answer)
		let medias = req.files["media"];

		if (!commentId || !userId || !text) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
			// Missing parameters
		}

		// Get the comment where the user wants to answer
		const comment = await CommentModel.findById({ _id: commentId });

		// Checks if exist
		if (!comment) {
			return res.status(404).send({
				error: true,
				message: "Impossible d'ajouter une réponse à un commentaire inexistant",
			});
			// Cannot add an answer to a comment who doesn't exist
		}

		if (parentAnswerId) {
			// Fetch the parentAnswer
			const parentAnswer = await AnswerModel.findById({
				_id: parentAnswerId,
			});

			// Checks if the parentAnswer exist
			if (!parentAnswer) {
				return res.status(404).send({
					error: true,
					message:
						"Impossible d'ajouter une réponse à une réponse qui n'existe pas",
				});
			}
		}

		const uploadResponse = await uploadFiles(medias, "answer");

		const newAnswer = new AnswerModel({
			postId: comment.postId, // Always set the same postId as the answered comment
			repostId: comment.repostId, // Always set the same repostId as the answered comment
			commentId: commentId,
			parentAnswerId: parentAnswerId,
			answererId: userId, // Use the userId query as answererId
			text: text,
			media: medias ? uploadResponse : [],
		});

		newAnswer
			.save()
			.then(async (answer) => {
				// Always increments 1 to answersLength on the corresponding commentId when adding an answer
				if (!parentAnswerId) {
					await CommentModel.findByIdAndUpdate(
						{ _id: commentId },
						{
							$inc: {
								answersLength: 1,
							},
						},
						{
							setDefaultsOnInsert: true,
							new: true,
						}
					);
				}
				// If there is an answerId so if it's an answer to an answer
				if (parentAnswerId) {
					// Then incr 1 to the corresponding answer
					await AnswerModel.findByIdAndUpdate(
						{ _id: parentAnswerId },
						{
							$inc: {
								answersLength: 1,
							},
						},
						{
							setDefaultsOnInsert: true,
							new: true,
						}
					);
				}
				return res.status(201).send(answer);
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getAnswers = (req, res, next) => {
	const { commentId, parentAnswerId } = req.query;
	const authUser = res.locals.user;

	if (!commentId) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
		// Missing parameters
	}

	AnswerModel.find({
		commentId: commentId,
		parentAnswerId: parentAnswerId,
	})
		.populate(
			"answererId",
			"lastName firstName userName blockedUsers isPrivate followers"
		)
		.exec()
		.then(async (answers) => {
			const filteredAnswers = await filterElements(
				answers,
				"answererId",
				authUser
			);

			if (filteredAnswers.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune réponses trouvée" });
			}

			res.status(200).send(filteredAnswers);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getAnswer = (req, res, next) => {
	const authUser = res.locals.user;

	AnswerModel.findOne({
		_id: req.params.id,
		commentId: req.query.commentId,
	})
		.populate(
			"answererId",
			"lastName firstName userName blockedUsers isPrivate followers"
		)
		.exec()
		.then(async (answer) => {
			if (!answer) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune réponse trouvé" });
			}
			const filteredAnswer = await filterElement(
				answer,
				"answererId",
				authUser
			);

			if (filteredAnswer.error) {
				return res.status(403).send(filteredAnswer);
			}

			return res.status(200).send(filteredAnswer);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.updateAnswer = (req, res, next) => {
	const { text } = req.body;
	let medias = req.files["media"];

	AnswerModel.findOne({
		_id: req.params.id,
		answererId: req.query.userId, // Gets the userId from the query (Helps to verify if it's the user answer)
	})
		.then(async (answer) => {
			if (!answer) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune réponse trouvé" });
			}

			// If the answer has medias then we remove it from cloudinary
			if (answer.media.length > 0) {
				await destroyFiles(answer, "answer");
			}

			const uploadResponse = await uploadFiles(medias, "answer");

			await AnswerModel.findOneAndUpdate(
				{
					_id: req.params.id,
					answererId: req.query.userId, // Gets the userId from the query (Helps to verify if it's the user answer)
				},
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
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.deleteAnswer = (req, res, next) => {
	AnswerModel.findOneAndDelete({
		_id: req.params.id, // Gets the _id from the params
		answererId: req.query.userId, // Gets the userId from the query (Helps to verify if it's the user answer)
	})
		.then(async (answer) => {
			if (!answer) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une réponse qui n'existe pas",
					// Cannot delete an answer who doesn't exist
				});
			}

			// If the answer has medias then delete those
			if (answer.media.length > 0) {
				await destroyFiles(answer, "answer");
			}

			async function hasNestedAnswers(answerId) {
				// Fetch the nested answers from the deleted answer
				const nestedAnswers = await AnswerModel.find({
					parentAnswerId: answerId,
				});

				// If there is any
				if (nestedAnswers.length > 0) {
					for (const nestedAnswer of nestedAnswers) {
						// Then loop through it to delete the medias (if there is any)
						if (nestedAnswer.media.length > 0) {
							await destroyFiles(nestedAnswer, "answer");
						}
						// Once medias are deleted we can delete the nested answers
						await AnswerModel.deleteMany({ parentAnswerId: answerId });

						// Then we call the function again for every nestedAnswer
						// to propagate the deletion through the response hierarchy
						await hasNestedAnswers(nestedAnswer._id);
					}
				}
				return;
			}

			// call the function and take the deleted answer._id has parameters
			await hasNestedAnswers(answer._id);

			return res.status(200).send(answer);
		})
		.catch((err) =>
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			})
		);
};

function checkIfReacted(answer, userId) {
	let hasReacted;

	// Set the variable hasReacted value where it returns true
	if (answer.reactions.like.includes(userId)) {
		hasReacted = "like";
	} else if (answer.reactions.awesome.includes(userId)) {
		hasReacted = "awesome";
	} else if (answer.reactions.love.includes(userId)) {
		hasReacted = "love";
	} else if (answer.reactions.funny.includes(userId)) {
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

		// Fetch the specified answer
		const answer = await AnswerModel.findById({ _id: req.params.id });

		if (!answer) {
			return res.status(404).send({
				error: true,
				message: "Impossible d'ajouter une réaction à une réponse inexistante",
				// Cannot add a reaction to an answer who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(answer, userId);

		// If the user already reacted
		if (lastUserReact) {
			if (lastUserReact === reaction) {
				return res.status(401).send({
					error: true,
					message: "Impossible d'ajouter la même réaction",
					// Cannot add the same reaction
				});
			}

			const updatedReaction = await AnswerModel.findByIdAndUpdate(
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

			return res.status(200).send(updatedReaction);
		}

		// If the user has not already voted
		const updatedReaction = await AnswerModel.findByIdAndUpdate(
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

		return res.status(200).send(updatedReaction);
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

		// Fetch the specified answer
		const answer = await AnswerModel.findById({ _id: req.params.id });

		if (!answer) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de supprimer la réaction d'une réponse inexistante",
				// Cannot delete a reaction from an answer who doesn't exist
			});
		}

		const lastUserReact = await checkIfReacted(answer, userId);

		if (!lastUserReact) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer une réaction inexistante",
				// Cannot delete a reaction who doesn't exist
			});
		}

		const updatedAnswer = await AnswerModel.findByIdAndUpdate(
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

		return res.status(200).send(updatedAnswer);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
