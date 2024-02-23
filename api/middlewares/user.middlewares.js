const UserModel = require("../models/users/User.model");

exports.isPrivate = async (req, res, next) => {
	try {
		const authUser = res.locals.user; // Get the auth user
		const user = await UserModel.findById({ _id: req.params.id }); // Fetch the requested user by his _id

		if (user.isPrivate === true && authUser._id !== user._id) {
			// Checks if the requested user has the authUser._id in his followers array
			// && if authUser has the requested user._id in his following array
			if (
				user.followers.includes(authUser._id) &&
				authUser.following.includes(user._id)
			) {
				return next(); // If yes then give access
			}
			// Else return an access denied response with limited user informations
			return res.status(403).send({
				user: {
					lastName: user.lastName,
					firstName: user.firstName,
					userName: user.userName,
					bio: user.bio,
					isPrivate: user.isPrivate,
				},
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

// Email validation for password reset
exports.checkIfMailExist = (req, res, next) => {

}
