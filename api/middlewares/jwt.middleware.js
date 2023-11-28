const jwt = require("jsonwebtoken");
const UserModel = require("../models/users/User.model");
const PostModel = require("../models/posts/Post.model");

exports.authenticate = (req, res, next) => {
	const token = req.headers?.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(403)
			.send({ error: true, message: "Accès refusé: aucun token reçu" });
	} else {
		jwt.verify(token, `${process.env.ACCESS_TOKEN}`, async (err, decoded) => {
			if (err) {
				res.locals.user = null;
				res.status(403).send({
					error: true,
					message: "Accès refusé: ce token n'est plus valide",
				});
			} else {
				if (decoded) {
					let user = await UserModel.findById(decoded.userId);
					res.locals.user = user;

					console.log(user);
					console.log(decoded);
					console.log(
						"---------- " + user.email + " est connecté" + "----------"
					);
					next();
				}
			}
		});
	}
};

exports.authorize = (req, res, next) => {
	let user = res.locals.user;
	const targetUser = req.params.id || req.body.userId;

	if (targetUser === user._id.toString()) {
		next();
	} else {
		return res.status(403).send({
			error: true,
			message: "Access denied",
		});
	}
};

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

exports.isAdmin = (req, res, next) => {
	let user = res.locals.user;
	if (user.admin === true) {
		next();
	} else {
		res.sendStatus(401);
	}
};
