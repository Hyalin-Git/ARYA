const ConversationModel = require("../../models/chats/Conversation.model");
const MessageModel = require("../../models/chats/Message.model");
const UserModel = require("../../models/user.model");

exports.saveMessage = (req, res, next) => {
	const { senderId, content, conversationId } = req.body;

	if (!senderId || !content || !conversationId) {
		return res
			.status(400)
			.send({ error: true, message: "Les données fournit sont invalides" });
	}

	const newMessage = new MessageModel({
		conversationId: conversationId,
		senderId: senderId,
		content: content,
	});
	newMessage
		.save()
		.then((newMessage) => {
			ConversationModel.findByIdAndUpdate(
				{ _id: newMessage.conversationId },
				{
					$addToSet: {
						messages: newMessage._id,
					},
					$set: {
						latestMessage: newMessage._id,
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			)
				.then((message) => res.status(201).send(message))
				.catch((err) => res.status(500).send(err));
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
	const { content } = req.body;
	MessageModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				content: content,
				isEdited: true,
			},
		},
		{
			new: true,
			setDefaultsOnInsert: true,
		}
	)
		.then((message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Impossible de modifier un message qui n'existe pas.",
				});
			}
			res.status(200).send(message);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteMessage = (req, res, next) => {
	MessageModel.findByIdAndDelete({ _id: req.params.id })
		.then((message) => {
			if (!message) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un message qui n'existe pas.",
				});
			}
			res.status(200).send(message);
		})
		.catch((err) => res.status(500).send(err));
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
