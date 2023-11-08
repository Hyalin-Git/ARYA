const ConversationModel = require("../../models/Conversation.model");

exports.accessOrCreateConversation = (req, res, next) => {
	const { userId, loggedUserId } = req.body;

	if (!userId || !loggedUserId) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur fournit" });
	}

	// To get the right conversation we need to fetch the conv
	//who is matching both of the usersId
	ConversationModel.find({
		isGroup: false,
		$and: [{ users: userId }, { users: loggedUserId }],
	})
		.populate("users", "lastName firstName userName")
		.exec()
		.then((conversation) => {
			// Si aucune conv n'a été trouvé alors on l'a créé
			if (!conversation[0]) {
				const conversationData = new ConversationModel({
					name: "default",
					users: [userId, loggedUserId],
				});
				conversationData
					.save()
					.then((createdConv) => {
						res.status(201).send(createdConv);
					})
					.catch((err) => res.status(500).send(err));
				return;
			}
			return res.status(200).send(conversation[0]);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getConversations = (req, res, next) => {
	const { userId } = req.body;
	ConversationModel.find({ users: userId })
		.sort({ updatedAt: "desc" })
		.populate("users", "lastName firstName userName")
		.populate("latestMessage")
		.exec()
		.then((conversations) => res.status(200).send(conversations))
		.catch((err) => res.status(500).send(err));
};
