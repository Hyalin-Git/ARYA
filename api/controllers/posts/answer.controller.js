const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const AnswerModel = require("../../models/posts/Answer.model");
const CommentModel = require("../../models/posts/Comment.model");

exports.saveAnswer = async (req, res, next) => {
	const { commentId, answerId, text } = req.body;
	const { userId } = req.query;
	let medias = req.files["media"];

	const uploadResponse = await uploadFiles(medias, "answer");

	if (!commentId || !userId || !text) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
	}

	const answer = new AnswerModel({
		commentId: commentId,
		answerId: answerId,
		answererId: userId, // Use the userId query as answererId
		text: text,
		media: medias ? uploadResponse : [],
	});

	answer
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
			if (answerId) {
				// Then incr 1 to the corresponding answer
				await AnswerModel.findByIdAndUpdate(
					{ _id: answerId },
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
		_id: req.params.id,
		answererId: req.query.userId,
	})
		.then(async (answer) => {
			if (!answer) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une réponse qui n'existe pas",
				});
			}

			if (answer.media.length > 0) {
				await destroyFiles(answer, "answer");
			}

			const answerOfAnswer = await AnswerModel.find({
				answerId: req.params.id,
			});

			for (const answersOfAnswers of answerOfAnswer) {
				if (answersOfAnswers.media.length > 0) {
					await destroyFiles(answersOfAnswers, "answer");
				}

				if (answersOfAnswers.answerId) {
					await AnswerModel.deleteMany({
						answerId: answersOfAnswers.answerId,
					});
				}
			}

			await AnswerModel.deleteMany({
				answerId: req.params.id,
			});

			return res.status(200).send(answer);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};
