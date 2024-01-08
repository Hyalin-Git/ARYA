const ConversationModel = require("../models/chats/Conversation.model");
const MessageRequestModel = require("../models/chats/MessageRequest.model");
const spamKeywords = require("../helpers/spamwords");
const UserModel = require("../models/users/User.model");

exports.canAccessConversation = async (req, res, next) => {
	try {
		const { userId, otherUserId } = req.query;

		if (!userId || !otherUserId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
		}

		// Getting the auth user
		const authUser = res.locals.user;
		// Getting the other user model in the conv
		const otherUser = await UserModel.findById({ _id: otherUserId });

		// If the auth user blocked the other user and vice versa
		if (
			authUser.blockedUsers.includes(otherUser._id) ||
			otherUser.blockedUsers.includes(authUser._id)
		) {
			// Then return the conversation but with a status code of 403
			// So the frontend know to not show the input to send a msg
			ConversationModel.findOne({
				_id: req.params.id,
				$and: [{ users: userId }, { users: otherUserId }],
			})
				.populate("users", "lastName firstName userName")
				.exec()
				.then((conversations) => {
					if (!conversations) {
						return res.status(404).send({
							error: true,
							message: "Cette conversation n'existe pas",
						});
					}
					res.status(403).send(conversations);
				})
				.catch((err) => res.status(500).send(err));
		} else {
			// Else the user can access the conversation normally
			next();
		}
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.canSendMessage = async (req, res, next) => {
	try {
		const authUser = res.locals.user;
		const { conversationId, content } = req.body;
		let medias = req.files["media"];

		const conversation = await ConversationModel.findById({
			_id: conversationId,
		});

		if (!conversation) {
			return res
				.status(404)
				.send({ error: true, message: "Cette conversation n'existe pas" });
		}

		const getOtherUser = conversation.users.find((userId) => {
			return authUser._id.toString() !== userId.toString();
		});

		const otherUser = await UserModel.findById({ _id: getOtherUser });
		if (!otherUser) {
			return res
				.status(404)
				.send({ error: true, message: "Cet utilisateur n'existe pas" });
		}

		if (authUser.blockedUsers.includes(getOtherUser)) {
			return res.status(403).send({
				error: true,
				message:
					"Vous avez bloqué cet utilisateur, veuillez le débloquer pour lui envoyer un message",
			});
		}

		if (otherUser.blockedUsers.includes(authUser._id)) {
			return res.status(403).send({
				error: true,
				message:
					"Vous avez été bloqué par cet utilisateur, impossible de lui envoyer un message",
			});
		}

		if (!conversation.latestMessage) {
			const message = content.toLowerCase();
			for (const keyword of spamKeywords) {
				if (message.includes(keyword)) {
					await ConversationModel.findByIdAndUpdate(
						{ _id: conversationId },
						{
							$set: {
								isSpam: true,
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					);
					next();
					return;
				}
			}
			if (medias) {
				return res.status(400).send({
					error: true,
					message: "Le premier message ne peut être un media",
				});
			}
		}

		if (otherUser.isPrivate === true && !conversation.latestMessage) {
			const messageRequest = new MessageRequestModel({
				fromUserId: authUser._id,
				toUserId: otherUser._id,
				toConversationId: conversation._id,
				messageContent: content,
			});

			await messageRequest.save();

			return res.status(200).send(messageRequest);
		}

		next();
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
