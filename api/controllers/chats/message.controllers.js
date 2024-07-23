const ConversationModel = require("../../models/chats/Conversation.model");
const MessageModel = require("../../models/chats/Message.model");
const UserModel = require("../../models/users/User.model");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");

exports.saveMessage = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { content, conversationId } = req.body;
		console.log(req.files["media"]);
		const medias = req.files["media"];

		if (!userId || !content || !conversationId) {
			return res
				.status(400)
				.send({ error: true, message: "Les données fournit sont invalides" });
		}

		const uploadResponse = medias ? await uploadFiles(medias, "message") : [];

		const newMessage = new MessageModel({
			conversationId: conversationId,
			senderId: userId,
			content: content,
			media: uploadResponse,
			readBy: userId,
		});
		newMessage
			.save()
			.then(async (newMessage) => {
				await ConversationModel.findByIdAndUpdate(
					{
						_id: newMessage.conversationId,
					},
					{
						$set: {
							latestMessage: newMessage._id,
						},
					},
					{ new: true, setDefaultsOnInsert: true }
				);

				res.status(201).send({ message: newMessage });
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
exports.getMessages = (req, res, next) => {
	MessageModel.find({ conversationId: req.query.conversationId })
		.then((message) => {
			if (message.length <= 0) {
				return res.status(404).send({
					error: true,
					message: "Cette conversation ne contient pas de message",
				});
			}
			res.status(200).send(message);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getMessage = (req, res, next) => {
	MessageModel.findById({ _id: req.params.id })
		.then((message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Ce message n'existe pas",
				});
			}
			res.status(200).send(message);
		})
		.catch((err) => res.status(500).send(err));
};

exports.editMessage = (req, res, next) => {
	const { userId } = req.query;
	const { content } = req.body;
	let medias = req.files["media"];

	MessageModel.findOne({ _id: req.params.id, senderId: userId })
		.then(async (message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Impossible de modifier un message qui n'existe pas.",
				});
			}
			if (message.media.length > 0) {
				await destroyFiles(message, "message"); // Destroy files only if there is medias
			}

			const uploadResponse = await uploadFiles(medias, "message");

			const updatedMessage = await MessageModel.findOneAndUpdate(
				{ _id: req.params.id, senderId: userId },
				{
					$set: {
						content: content,
						media: medias ? uploadResponse : [],
						isEdited: true,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(updatedMessage);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteMessage = async (req, res, next) => {
	const { userId } = req.query;

	// const message = await MessageModel.findOne({
	// 	_id: req.params.id,
	// 	senderId: userId,
	// });

	// if (!message) {
	// 	return res.status(404).send({
	// 		error: true,
	// 		message: "Impossible de supprimer un message qui n'existe pas.",
	// 	});
	// }

	MessageModel.findOneAndDelete({ _id: req.params.id, senderId: userId })
		.then(async (message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un message qui n'existe pas.",
				});
			}

			if (message.media.length > 0) {
				await destroyFiles(message, "message");
			}
			const newLatestMessage = await MessageModel.findOne({
				conversationId: message.conversationId,
			})
				.sort({ createdAt: "desc" })
				.exec();
			console.log(newLatestMessage);
			await ConversationModel.findByIdAndUpdate(
				{ _id: newLatestMessage.conversationId },
				{
					$set: {
						latestMessage: newLatestMessage?._id,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(message);
		})
		.catch((err) => {
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			});
		});
};

exports.addToRead = (req, res, next) => {
	const { userId } = req.query;

	MessageModel.findOne({ _id: req.params.id })
		.then(async (message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Impossible de lire un message qui n'existe pas.",
				});
			}

			const updatedMessage = await MessageModel.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$addToSet: {
						readBy: userId,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(updatedMessage);
		})
		.catch((err) => res.status(500).send(err));
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
		const { conversationId, senderId, reaction } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user reaction)
		const allowedReactions = ["like", "awesome", "funny", "love"];

		if (!conversationId || !senderId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
		}

		// Checks if the given reaction is in the allowedReactions array
		if (!allowedReactions.includes(reaction)) {
			return res
				.status(400)
				.send({ error: true, message: "La réaction fournit est invalide" });
			// The given reaction is not valid
		}

		// Fetch the specified comment
		const message = await MessageModel.findOneAndUpdate({
			_id: req.params.id,
			conversationId: conversationId,
			senderId: senderId,
		});

		if (!message) {
			return res.status(404).send({
				error: true,
				message: "Impossible d'ajouter une réaction à un message inexistant",
				// Cannot add a reaction to a comment who doesn't exist
			});
		}

		const lastUserReact = checkIfReacted(message, userId);

		// If the user already reacted
		if (lastUserReact) {
			if (lastUserReact === reaction) {
				return res.status(401).send({
					error: true,
					message: "Impossible d'ajouter la même réaction",
					// Cannot add the same reaction
				});
			}

			const updatedMessage = await MessageModel.findOneAndUpdate(
				{
					_id: req.params.id,
					conversationId: conversationId,
					senderId: senderId,
				},
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

			return res.status(200).send(updatedMessage);
		}

		// If the user has not already voted
		const updatedMessage = await MessageModel.findByIdAndUpdate(
			{
				_id: req.params.id,
				conversationId: conversationId,
				senderId: senderId,
			},
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

		return res.status(200).send(updatedMessage);
	} catch (err) {
		res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.deleteReaction = async (req, res, next) => {
	try {
		const { conversationId, senderId } = req.body;
		const { userId } = req.query; // Gets the userId from the query (Helps to verify if it's the user reaction)

		if (!conversationId || !senderId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
		}

		// Fetch the specified comment
		const message = await MessageModel.findById({
			_id: req.params.id,
			conversationId: conversationId,
			senderId: senderId,
		});

		if (!message) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer la réaction d'un message inexistant",
				// Cannot delete a reaction from a comment who doesn't exist
			});
		}

		const lastUserReact = checkIfReacted(message, userId);

		if (!lastUserReact) {
			return res.status(400).send({
				error: true,
				message: "Impossible de supprimer une réaction inexistante",
				// Cannot delete a reaction who doesn't exist
			});
		}

		const updatedMessage = await MessageModel.findByIdAndUpdate(
			{
				_id: req.params.id,
				conversationId: conversationId,
				senderId: senderId,
			},
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

		return res.status(200).send(updatedMessage);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
