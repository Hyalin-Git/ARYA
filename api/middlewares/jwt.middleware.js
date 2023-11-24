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

	// The authentified user is trying to fetch an user informations
	const requestedUser = await UserModel.findById({ _id: req.params.id });
	const authUserRequestedUser = await UserModel.findById({ _id: authUser._id });

	// Before giving informations checking if the auth is blocked or not
	if (
		requestedUser.blockedUsers.includes(authUser._id) ||
		authUserRequestedUser.blockedUsers.includes(requestedUser._id)
	) {
		return res.status(403).send({
			error: true,
			message: "Vous avez été bloqué par cette utilisateur",
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

exports.checkPostAccess = async (req, res, next) => {
	let authUser = res.locals.user;
	try {
		const posts = await PostModel.find({
			posterId: { $nin: authUser.blockedUsers },
		});

		res.locals.filteredPosts = posts;
		next();
		return;
	} catch (err) {
		return res.status(500).send(err);
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
