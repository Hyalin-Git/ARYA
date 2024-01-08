const ConversationModel = require("../../models/chats/Conversation.model");
const MessageModel = require("../../models/chats/Message.model");
const MessageRequestModel = require("../../models/chats/MessageRequest.model");

exports.getMessageRequests = (req, res, next) => {
	const { userId } = req.query;
	MessageRequestModel.find({ toUserId: userId })
		.then((messageRequests) => {
			if (messageRequests.length <= 0) {
				return res.status(404).send({
					error: true,
					message: "Aucune demande de message n'a été trouvé",
				});
			}

			res.status(200).send(messageRequests);
		})
		.catch((err) =>
			res.status(500).send(err.message || "Erreur interne du serveur")
		);
};

exports.acceptMessageRequests = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const messageRequest = await MessageRequestModel.findOne({
			_id: req.params.id,
			toUserId: userId,
		});

		if (!messageRequest) {
			return res.status(404).send({
				error: true,
				message: "Impossible d'accepter une demande de message inexistante",
			});
		}

		const newMessage = new MessageModel({
			conversationId: messageRequest.toConversationId,
			senderId: messageRequest.fromUserId,
			content: messageRequest.messageContent,
			media: [],
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

				res.status(201).send(newMessage);
			})
			.catch((err) => res.status(500).send(err));

		await MessageRequestModel.findOneAndDelete({
			_id: req.params.id,
			toUserId: userId,
		});
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.declineMessageRequests = (req, res, next) => {
	const { userId } = req.query;

	MessageRequestModel.findOneAndDelete({
		_id: req.params.id,
		toUserId: userId,
	})
		.then((deletedMessageRequest) => {
			if (!deletedMessageRequest) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une demande de message inexistante",
				});
			}

			res.status(200).send(deletedMessageRequest);
		})
		.catch((err) =>
			res.status(200).send(err.message || "Erreur interne du serveur")
		);
};
