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
