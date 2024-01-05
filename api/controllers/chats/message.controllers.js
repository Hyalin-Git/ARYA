const ConversationModel = require("../../models/chats/Conversation.model");
const MessageModel = require("../../models/chats/Message.model");
const UserModel = require("../../models/users/User.model");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const spamKeywords = require("../../helpers/spamwords");

exports.saveMessage = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { content, conversationId } = req.body;
		let medias = req.files["media"];

		if (!userId || !content || !conversationId) {
			return res
				.status(400)
				.send({ error: true, message: "Les données fournit sont invalides" });
		}

		const messagesOfConversation = await MessageModel.find({
			conversationId: conversationId,
		});

		// If it's the first message of the conversation then it will checks if it's probably a spam or not
		function spamChecker() {
			const message = content.toLowerCase();
			for (const keyword of spamKeywords) {
				if (message.includes(keyword)) {
					return true;
				}
			}
		}

		if (messagesOfConversation.length <= 0) {
			if (spamChecker()) {
				await ConversationModel.findByIdAndUpdate(
					{ _id: conversationId },
					{
						$set: {
							isSpam: true,
						},
					}
				);
			}
		}

		const uploadResponse = await uploadFiles(medias, "message");

		const newMessage = new MessageModel({
			conversationId: conversationId,
			senderId: userId,
			content: content,
			media: medias ? uploadResponse : [],
		});
		newMessage
			.save()
			.then((newMessage) => {
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
	let medias = req.files["media"];
	const { content } = req.body;

	MessageModel.findById({ _id: req.params.id })
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
			const updatedMessage = await MessageModel.findByIdAndUpdate(
				{ _id: req.params.id },
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

exports.deleteMessage = (req, res, next) => {
	MessageModel.findById({ _id: req.params.id })
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

			await MessageModel.findByIdAndDelete({ _id: req.params.id });
			const conversationUpdated = await ConversationModel.findByIdAndUpdate(
				{ _id: message.conversationId },
				{
					$pull: {
						messages: message._id,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res
				.status(200)
				.send({ message: message, conversation: conversationUpdated });
		})
		.catch((err) => res.status(500).send(err.message ? err.message : err));
};

const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReaction = (req, res, next) => {
	const { reaction, userId } = req.body;

	function setReaction(reaction) {
		MessageModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		)
			.then((message) => {
				if (!message) {
					return res
						.status(404)
						.send(
							"Impossible d'ajouter une reaction sur un message qui n'existe pas."
						);
				}
				res.status(200).send(message);
			})
			.catch((err) => res.status(500).send(err));
	}

	MessageModel.findById({ _id: req.params.id })
		.then((message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Ce message n'existe pas",
				});
			}
			if (
				reactionsArray.some((reaction) =>
					message.reactions[reaction].includes(userId)
				)
			) {
				return res
					.status(401)
					.send({ error: true, message: "Cet utilisateur a déjà réagit" }); // This user already reacted
			}
			UserModel.findById({ _id: userId })
				.then((user) => {
					if (!user) {
						return res.status(404).send({
							error: true,
							message: "Utilisateur introuvable.",
						});
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

	function delReaction(reaction) {
		MessageModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		)
			.then((message) => {
				if (!message) {
					return res
						.status(404)
						.send(
							"Impossible d'ajouter une reaction sur un message qui n'existe pas."
						);
				}
				res.status(200).send(message);
			})
			.catch((err) => res.status(500).send(err));
	}

	MessageModel.findById({ _id: req.params.id })
		.then((message) => {
			if (message.reactions.like.includes(userId)) {
				return delReaction("like");
			}
			if (message.reactions.awesome.includes(userId)) {
				return delReaction("awesome");
			}
			if (message.reactions.funny.includes(userId)) {
				return delReaction("funny");
			}
			if (message.reactions.love.includes(userId)) {
				return delReaction("love");
			} else {
				return res.status(404).send({
					error: true,
					message: "Cet utilisateur n'a pas réagit à ce message",
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};
