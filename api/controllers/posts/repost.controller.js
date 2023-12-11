const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");
const { getFormattedDates } = require("../../helpers/formattingDates");
const RepostModel = require("../../models/posts/Repost.model");
const moment = require("moment");
const UserModel = require("../../models/users/User.model");

exports.saveRepost = async (req, res, next) => {
	// let scheduledTime = moment();
	let medias = req.files["media"];

	// const { month, day, year, hour } = req.body;
	// const scheduledSendTime = await getFormattedDates(
	// 	scheduledTime,
	// 	month,
	// 	day,
	// 	year,
	// 	hour
	// );
	// const isScheduled = month || day || year || hour;

	const uploadResponse = await uploadFiles(medias, "post");

	const repost = new RepostModel({
		reposterId: req.query.userId,
		text: req.body.text,
		media: medias ? uploadResponse : [],
		postId: req.body.postId,
	});
	repost
		.save()
		.then((repost) => res.status(201).send(repost))
		.catch((err) => res.status(500).send(err));
};

exports.getReposts = (req, res, next) => {
	const authUser = res.locals.user;

	RepostModel.find({ reposterId: { $nin: authUser.blockedUsers } })
		.populate("reposterId postId", "userName lastName firstName")
		.exec()
		.then((reposts) => {
			if (reposts.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}
			return res.status(200).send(reposts);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getRepost = (req, res, next) => {
	const authUser = res.locals.user;

	RepostModel.findById({ _id: req.params.id })
		.populate("reposterId postId", "userName lastName firstName text media")
		.exec()
		.then(async (reposts) => {
			if (!reposts) {
				return res
					.status(404)
					.send({ error: true, message: "Aucune publication trouvée" });
			}

			const reposterUser = await UserModel.findById({
				_id: reposts.reposterId._id,
			});

			if (reposterUser.blockedUsers.includes(authUser._id)) {
				return res.status(403).send({
					error: true,
					message:
						"Impossible de récupérer la publication d'un utilisateur qui vous a bloqué",
				});
			}

			if (authUser.blockedUsers.includes(reposts.reposterId._id)) {
				return res.status(403).send({
					error: true,
					message:
						"Impossible de récupérer la publication d'un utilisateur que vous avez bloqué",
				});
			}

			return res.status(200).send(reposts);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateRepost = (req, res, next) => {
	let medias = req.files["media"];

	RepostModel.findOne({
		_id: req.params.id,
		reposterId: req.query.userId,
	})
		.then(async (repost) => {
			if (!repost) {
				return res.status(404).send({
					error: true,
					message: "Impossible de modifier une publication qui n'existe pas",
				});
			}

			if (repost.media.length > 0) {
				await destroyFiles(repost, "post"); // Destroy files only if there is medias
			}

			const uploadResponse = await uploadFiles(medias, "post");
			const updatedRepost = await RepostModel.findOneAndUpdate(
				{ _id: req.params.id, reposterId: req.query.userId },
				{
					$set: {
						text: req.body.text,
						media: medias ? uploadResponse : [],
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send(updatedRepost);
		})
		.catch((err) => res.status(500).send(err));
};
const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReactionRepost = (req, res, next) => {
	const { reaction } = req.body;
	const { userId } = req.query;

	if (!reaction || userId) {
		return res.status(400).send({
			error: true,
			message: "Paramètres manquant",
		});
	}

	if (!reactionsArray.includes(reaction)) {
		return res.status(400).send({
			error: true,
			message: "Les paramètres fournit sont invalides",
		});
	}

	function setReaction(reaction) {
		RepostModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		)
			.then((repost) => {
				if (!repost) {
					return res
						.status(404)
						.send({ error: true, message: "Cette publication n'existe pas" });
				}
				return res.status(200).send(repost);
			})
			.catch((err) => res.status(500).send(err));
	}

	RepostModel.findById({ _id: req.params.id })
		.then((repost) => {
			if (
				reactionsArray.some((reaction) =>
					repost.reactions[reaction].includes(userId)
				)
			) {
				return res.status(401).send({})
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteReactionRepost = (req, res, next) => {};

exports.deleteRepost = (req, res, next) => {
	const { userId } = req.query;
	RepostModel.findOne({ _id: req.params.id, reposterId: userId })
		.then(async (repost) => {
			if (!repost) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une publication qui n'existe pas",
				});
			}
			if (repost.media.length > 0) {
				await destroyFiles(repost, "post");
			}
			await RepostModel.findOneAndDelete({
				_id: req.params.id,
				reposterId: userId,
			});

			return res.status(200).send(repost);
		})
		.catch((err) => res.status(500).send(err));
};
