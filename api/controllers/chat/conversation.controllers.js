const ConversationModel = require("../../models/chats/Conversation.model");
const MessageModel = require("../../models/chats/Message.model");

exports.accessOrCreateConversation = (req, res, next) => {
	const { userId, otherUserId } = req.body;

	if (!userId || !otherUserId) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur fournit" });
	}

	// To get the right conversation we need to fetch the conv
	//who is matching both of the usersId
	ConversationModel.find({
		isGroup: false,
		$and: [{ users: userId }, { users: otherUserId }],
	})
		.populate("users", "lastName firstName userName")
		.exec()
		.then((conversation) => {
			// Si aucune conv n'a été trouvé alors on l'a créé
			if (!conversation[0]) {
				const conversationData = new ConversationModel({
					name: "default",
					users: [userId, otherUserId],
				});
				conversationData
					.save()
					.then((createdConv) => {
						res.status(201).send(createdConv);
					})
					.catch((err) => res.status(500).send(err));
				return;
			}
			res.status(200).send(conversation[0]);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getConversations = (req, res, next) => {
	const { userId } = req.query;
	if (!userId) {
		return res.status(400).send({ error: true, message: "Paramètre manquant" });
	}
	ConversationModel.find({ users: userId })
		.sort({ updatedAt: "desc" })
		.populate("users", "lastName firstName userName")
		.populate({
			path: "latestMessage",
			populate: {
				path: "senderId",
				select: "lastName firstName userName",
			},
		})
		.exec()
		.then((conversations) => res.status(200).send(conversations))
		.catch((err) => res.status(500).send(err));
};

exports.getConversation = (req, res, next) => {
	const { userId, otherUserId } = req.query;
	ConversationModel.findOne({
		_id: req.params.id,
		$and: [{ users: userId }, { users: otherUserId }],
	})
		.populate("users", "lastName firstName userName")
		.populate("messages")
		.exec()
		.then((conversations) => {
			if (!conversations) {
				return res
					.status(404)
					.send({ error: true, message: "Cette conversation n'existe pas" });
			}
			res.status(200).send(conversations);
		})
		.catch((err) => res.status(500).send(err));
};

exports.editConversation = (req, res, next) => {
	ConversationModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				name: req.body.name,
			},
		},
		{
			new: true,
			setDefaultsOnInsert: true,
		}
	)
		.then((conversations) => {
			if (!conversations) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une conversation qui n'existe pas.",
				});
			}
			res.status(200).send(conversations);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteConversation = (req, res, next) => {
	const { userId, otherUserId } = req.body;
	ConversationModel.findOneAndDelete({
		_id: req.params.id,
		$and: [{ users: userId }, { users: otherUserId }],
	})
		.then((conversations) => {
			if (!conversations) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une conversation qui n'existe pas.",
				});
			}
			MessageModel.deleteMany({ conversationId: conversations._id })
				.then((del) => res.status(200).send(del))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
