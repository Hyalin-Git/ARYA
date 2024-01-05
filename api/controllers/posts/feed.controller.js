const UserModel = require("../../models/users/User.model");
const PostModel = require("../../models/posts/Post.model");
const RepostModel = require("../../models/posts/Repost.model");
const {
	filterPosts,
	filterReposts,
} = require("../../helpers/filterByBlocksByPrivate");

exports.getAllFeed = async (req, res, next) => {
	try {
		const authUser = res.locals.user;
		const { limit } = req.query;

		const posts = await PostModel.find({ status: "sent" })
			.populate(
				"posterId",
				"userName lastName firstName blockedUsers isPrivate followers"
			)
			.exec();

		const reposts = await RepostModel.find()
			.populate(
				"reposterId",
				"userName lastName firstName blockedUsers isPrivate followers"
			)
			.populate({
				path: "postId",
				select: "text media",
				populate: {
					path: "posterId",
					select: "lastName firstName userName blockedUsers",
				},
			})
			.exec();

		const filteredPosts = await filterPosts(posts, authUser);
		const filteredReposts = await filterReposts(reposts, authUser);

		const feed = [...filteredPosts, ...filteredReposts];

		if (feed.length <= 0) {
			return res
				.status(404)
				.send({ error: true, message: "Aucune publication trouvée" });
		}

		const sortedFeed = feed.sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		const feedSpliced = sortedFeed.slice(0, limit ?? 5);

		return res.status(200).send(feedSpliced);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getByFollowingFeed = async (req, res, next) => {
	try {
		const authUser = req.locals.user;

		const posts = await PostModel.find({
			posterId: { $in: authUser.following },
		})
			.populate("posterId", "userName lastName firstName")
			.exec();

		const reposts = await RepostModel.find({
			reposterId: { $in: authUser.following },
		})
			.populate("reposterId", "userName lastName firstName")
			.populate({
				path: "postId",
				select: "text media",
				populate: {
					path: "posterId",
					select: "lastName firstName userName",
				},
			})
			.exec();

		const feed = [...posts, ...reposts];

		if (feed.length <= 0) {
			return res
				.status(404)
				.send({ error: true, message: "Aucune publication trouvée" });
		}

		const sortedFeed = feed.sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		const feedSpliced = sortedFeed.splice(0, limit ?? 5);

		return res.status(200).send(feedSpliced);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
