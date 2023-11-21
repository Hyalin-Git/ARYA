const CommentModel = require("../../models/posts/Comment.model");
const UserModel = require("../../models/users/User.model");
const {
	uploadFiles,
	destroyFiles,
} = require("../../helpers/cloudinaryManager");

exports.addComment = async (req, res, next) => {
	let medias = req.files["media"];
	let uploadResponse = await uploadFiles(medias, "comment");

	const comment = new CommentModel({
		postId: req.body.postId,
		commenterId: req.body.commenterId,
		text: req.body.text,
		media: uploadResponse,
	});

	comment
		.save()
		.then((comment) => res.status(201).send(comment))
		.catch((err) => res.status(500).send(err));
};

exports.getComments = (req, res, next) => {
	CommentModel.find()
		.populate("commenterId", "userName lastName firstName")
		.exec()
		.then((post) => res.status(200).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.getComment = (req, res, next) => {
	CommentModel.findById({ _id: req.params.id })
		.populate("commenterId", "userName lastName firstName")
		.exec()
		.then((post) => res.status(200).send(post))
		.catch((err) => res.status(500).send(err));
};

exports.editComment = (req, res, next) => {
	let medias = req.files["media"];
	CommentModel.findById({ _id: req.params.id })
		.then(async (comment) => {
			if (!comment) {
				return res.status(404).send({
					error: true,
					message: "Could not find a matching comment",
				});
			}

			if (comment.media.length > 0) {
				await destroyFiles(comment, "comment");
			}

			const uploadResponse = await uploadFiles(medias, "comment");
			const updateComment = await CommentModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						text: req.body.text,
						media: medias ? uploadResponse : [],
					},
				},
				{
					setDefaultsOnInsert: true,
					new: true,
				}
			);
			return res.status(200).send(updateComment);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteComment = (req, res, next) => {
	CommentModel.findById({ _id: req.params.id })
		.then(async (comment) => {
			if (!comment) {
				return res.status(404).send({
					error: true,
					message: "Could not find a matching comment",
				});
			}
			try {
				await destroyFiles(comment, "comment"); // Delete all files from Cloudinary
				await CommentModel.findByIdAndDelete({ _id: req.params.id }); // Then delete the comment
				res.status(200).send(comment);
			} catch (err) {
				return res.status(500).json({ error: true, message: err.message });
			}
		})
		.catch((err) => res.status(500).send(err));
};

const reactionsArray = ["like", "awesome", "funny", "love"];

exports.addReaction = (req, res, next) => {
	const { reaction, userId } = req.body;

	// this function adds user reaction to the specified comment
	function setReaction(reaction) {
		CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((comment) => {
				if (!comment) {
					return res.status(404).send("Could not find a matching comment");
				}
				return res.status(200).send(comment);
			})
			.catch((err) => res.status(500).send(err));
	}

	CommentModel.findById({ _id: req.params.id })
		.then((comment) => {
			// This condition is checking in every reaction array if it includes the userId
			if (
				reactionsArray.some((reaction) =>
					comment.reactions[reaction].includes(userId)
				)
			) {
				return res
					.status(401)
					.send({ error: true, message: "Cet utilisateur a déjà réagit" }); // This user already reacted
			}

			// Checking if the user exist
			UserModel.findById({ _id: userId })
				.then((user) => {
					if (!user) {
						return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
					}
					switch (reaction) {
						case "like":
							setReaction("like");
							break;
						case "awesome":
							setReaction("awesome");
							break;
						case "funny":
							setReaction("funny");
							break;
						case "love":
							setReaction("love");
							break;
						default:
							res.status(400).send({
								error: true,
								message: "Aucune réaction n'a été sélectionné", // No reaction has been selected
							});
							break;
					}
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteReaction = (req, res, next) => {
	const { userId } = req.body;

	// This function removes user reaction to the specified comment
	function delReaction(reaction) {
		CommentModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					[`reactions.${reaction}`]: userId,
				},
			},
			{ new: true, setDefaultsOnInsert: true }
		)
			.then((comment) => {
				if (!comment) {
					return res.status(404).send("Could not find a matching comment");
				}
				return res.status(200).send(comment);
			})
			.catch((err) => res.status(500).send(err));
	}

	CommentModel.findById({ _id: req.params.id })
		.then((comment) => {
			if (comment.reactions.like.includes(userId)) {
				return delReaction("like");
			}
			if (comment.reactions.awesome.includes(userId)) {
				return delReaction("awesome");
			}
			if (comment.reactions.funny.includes(userId)) {
				return delReaction("funny");
			}
			if (comment.reactions.love.includes(userId)) {
				return delReaction("love");
			} else {
				return res.status(404).send({
					error: true,
					message: "Cet utilisateur n'a pas réagit à ce commentaire",
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};
