const FollowRequestModel = require("../../models/users/FollowRequest.model");
const UserModel = require("../../models/users/User.model");

// There is no save followRequests because the followRequest is created within the follow controller (check user controllers)

exports.getFollowRequests = (req, res, next) => {
	const { userId } = req.query;

	FollowRequestModel.find({ toUserId: userId })
		.then((followRequests) => {
			if (followRequests.length <= 0) {
				return res.status(404).send({
					error: true,
					message: "Aucune demande de follow n'a été trouvé",
				});
			}
			return res.status(200).send(followRequests);
		})
		.catch((err) => {
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			});
		});
};

exports.acceptFollowRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		if (!userId) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquants" });
		}

		const followRequest = await FollowRequestModel.findOne({
			_id: req.params.id,
			toUserId: userId,
		});

		if (!followRequest) {
			return res.status(404).send({
				error: true,
				message: "Impossible d'accepter une demande inexistante",
			});
		}

		const userFollowing = await UserModel.findByIdAndUpdate(
			{ _id: followRequest.fromUserId },
			{
				$addToSet: {
					following: followRequest.toUserId,
				},
			},
			{
				setDefaultsOnInsert: true,
				new: true,
			}
		);

		const userFollowed = await UserModel.findByIdAndUpdate(
			{ _id: followRequest.toUserId },
			{
				$addToSet: {
					followers: followRequest.fromUserId,
				},
			},
			{
				setDefaultsOnInsert: true,
				new: true,
			}
		);

		await FollowRequestModel.findOneAndDelete({
			_id: req.params.id,
			toUserId: userId,
		});

		return res.status(200).send({
			userFollowing: userFollowing.following,
			FollowedUser: userFollowed.followers,
		});
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.declineFollowRequest = (req, res, next) => {
	const { userId } = req.query;

	FollowRequestModel.findOneAndDelete({
		_id: req.params.id,
		toUserId: userId,
	})
		.then((deletedFollowRequest) => {
			if (!deletedFollowRequest) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une demande de follow inexistante",
				});
			}
			res.status(200).send(deletedFollowRequest);
		})
		.catch((err) => {
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			});
		});
};
