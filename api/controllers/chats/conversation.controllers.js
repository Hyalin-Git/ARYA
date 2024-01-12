const ConversationModel = require("../../models/chats/Conversation.model");

exports.accessOrCreateConversation = (req, res, next) => {
	const { userId, otherUserId } = req.query;

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
		.then(async (conversation) => {
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

			if (conversation[0].isDeletedFor.includes(userId)) {
				await ConversationModel.findByIdAndUpdate(
					{ _id: conversation[0]._id },
					{
						$pull: {
							isDeletedFor: userId,
						},
					},
					{
						new: true,
						setDefaultsOnInsert: true,
					}
				);
			}

			res.status(200).send(conversation[0]);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getConversations = (req, res, next) => {
	const { userId } = req.query;

	ConversationModel.find({ users: userId, isDeletedFor: { $ne: userId } })
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
		.then((conversations) => {
			if (conversations.length <= 0) {
				return res.status(404).send({
					error: true,
					message: "Aucune conversations n'a été trouvé",
				});
			}
			res.status(200).send(conversations);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getConversation = (req, res, next) => {
	const { userId, otherUserId } = req.query;

	ConversationModel.findOne({
		_id: req.params.id,
		$and: [
			{ users: userId },
			{ users: otherUserId },
			{ isDeletedFor: { $ne: userId } },
		],
	})
		.populate("users", "lastName firstName userName")
		.exec()
		.then((conversation) => {
			if (!conversation) {
				return res
					.status(404)
					.send({ error: true, message: "Cette conversation n'existe pas" });
			}
			res.status(200).send(conversation);
		})
		.catch((err) => res.status(500).send(err));
};

exports.editConversation = (req, res, next) => {
	const { userId, otherUserId } = req.query;
	const { name } = req.body;

	if (!userId || !otherUserId || !name) {
		return res
			.status(400)
			.send({ error: true, message: "Paramètres manquants" });
	}

	if (name.length > 20) {
		return res.status(400).send({
			error: true,
			message: "Le nom de la conversation ne peut dépasser 20 charactères",
		});
	}

	ConversationModel.findByIdAndUpdate(
		{ _id: req.params.id, users: [userId, otherUserId] },
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
	const { userId, otherUserId } = req.query;

	ConversationModel.findOneAndUpdate(
		{
			_id: req.params.id,
			$and: [{ users: userId }, { users: otherUserId }],
		},
		{
			$addToSet: {
				isDeletedFor: userId,
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
