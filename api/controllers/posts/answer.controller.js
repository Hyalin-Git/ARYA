const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const AnswerModel = require("../../models/posts/Answer.model");
const CommentModel = require("../../models/posts/Comment.model");

exports.saveAnswer = async (req, res, next) => {
	try {
		const { commentId, parentAnswerId, answerToId, text } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user answer)
		let medias = req.files["media"];

		const uploadResponse = await uploadFiles(medias, "answer");

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

		if (answerToId || parentAnswerId) {
			const answer = await AnswerModel.findById({ _id: answerToId });

			if (!answer) {
				return res.status(404).send({
					error: true,
					message:
						"Impossible d'ajouter une réponse à une réponse qui n'existe pas",
				});
			}

			const parentAnswer = await AnswerModel.findById({
				_id: parentAnswerId,
			});

			if (!parentAnswer) {
				return res.status(404).send({
					error: true,
					message:
						"Impossible d'ajouter une réponse à une réponse qui n'existe pas",
				});
			}
		}

		const newAnswer = new AnswerModel({
			commentId: commentId,
			parentAnswerId: parentAnswerId,
			answerToId: answerToId,
			answererId: userId, // Use the userId query as answererId
			text: text,
			media: medias ? uploadResponse : [],
		});

		newAnswer
			.save()
			.then(async (answer) => {
				// Always increments 1 to answersLength on the corresponding commentId when adding an answer
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
				// If there is an answerId so if it's an answer to an answer
				if (answerToId) {
					// Then incr 1 to the corresponding answer
					await AnswerModel.findByIdAndUpdate(
						{ _id: answerToId },
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
			message: err.message,
		});
	}
};

exports.getAnswers = (req, res, next) => {
	AnswerModel.find({
		commentId: req.query.commentId,
		answerId: req.query.answerId,
	})
		.populate("answererId", "lastName firstName userName")
		.exec()
		.then((answers) => res.status(200).send(answers))
		.catch((err) => res.status(500).send(err));
};

exports.getAnswer = (req, res, next) => {
	AnswerModel.findOne({
		_id: req.params.id,
		commentId: req.query.commentId,
	})
		.populate("answererId", "lastName firstName userName")
		.exec()
		.then((answer) => res.status(200).send(answer))
		.catch((err) => res.status(500).send(err));
};

exports.updateAnswer = (req, res, next) => {
	const { text } = req.body;
	let medias = req.files["media"];

	if (!text) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquant" });
	}

	AnswerModel.findOne({
		_id: req.params.id,
		answererId: req.query.userId,
	})
		.then(async (answer) => {
			if (!answer) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune réponse trouvé" });
			}
			if (answer.media.length > 0) {
				await destroyFiles(answer, "answer");
			}

			const uploadResponse = await uploadFiles(medias, "answer");

			await AnswerModel.findOneAndUpdate(
				{
					_id: req.params.id,
					answererId: req.query.userId,
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

			// Gets every answers where _id is in the deleted answer.answersId array
			const answersOfAnswers = await AnswerModel.find({
				parentAnswerId: answer._id,
			});

			for (const answerOfAnswer of answersOfAnswers) {
				// Checks in every answer of answer if they have medias
				if (answerOfAnswer.media.length > 0) {
					// If yes delete those
					await destroyFiles(answerOfAnswer, "answer");
				}
			}

			// And delete every answer where parentAnswerId is == to the deleted answer ID.
			await AnswerModel.deleteMany({ parentAnswerId: answer._id });

			return res.status(200).send(answer);
		})
		.catch((err) => res.status(500).send(err));
};
