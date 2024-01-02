const UserModel = require("../models/users/User.model");
const ConversationModel = require("../models/chats/Conversation.model");

exports.isBlocked = async (req, res, next) => {
	let authUser = res.locals.user;

	const AuthUserModel = await UserModel.findById({ _id: authUser._id });
	// The authentified user is trying to fetch user informations
	const requestedUser = await UserModel.findById({ _id: req.params.id });

	const isAuthUserBlocked = requestedUser.blockedUsers.includes(
		AuthUserModel._id
	);
	const isRequestedUserBlocked = AuthUserModel.blockedUsers.includes(
		requestedUser._id
	);

	// Checking if auth user is blocked || if auth user has blocked the user
	if (isAuthUserBlocked || isRequestedUserBlocked) {
		return res.status(403).send({
			error: true,
			message: `${
				isAuthUserBlocked
					? "Vous avez été bloqué par cet utilisateur"
					: "Vous avez bloqué cet utilisateur"
			}`,
			UserInfo: {
				lastName: requestedUser.lastName,
				firstName: requestedUser.firstName,
				userName: requestedUser.userName,
				picture: requestedUser.picture,
			},
		});
	} else {
		next();
	}
};

exports.checkMsgSpam = async (req, res, next) => {
	try {
	} catch (err) {}
};

exports.canSendMessage = async (req, res, next) => {
	try {
		const authUser = res.locals.user;

		const conversation = await ConversationModel.findById({
			_id: req.body.conversationId,
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

		next();
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

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
