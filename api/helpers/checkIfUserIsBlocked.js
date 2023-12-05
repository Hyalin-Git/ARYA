const PostModel = require("../models/posts/Post.model");
const CommentModel = require("../models/posts/Comment.model");

exports.canAccessPosts = async (authUser, users) => {
	// Loop through every users
	for (const user of users) {
		// Checks if an user includes the authUserId in the blocked array.
		if (user.blockedUsers.includes(authUser._id)) {
			// Get every post where posterId !== user._id.
			// And where posterId is not in authUser blocked array (can be empty).
			const posts = await PostModel.find({
				$and: [
					{ posterId: { $ne: user._id } },
					{
						posterId: { $nin: authUser.blockedUsers },
					},
				],
			})
				.populate("posterId", "userName lastName firstName")
				.exec();

			return posts;
		}
	}
};

exports.canAccessComments = async (authUser, users, req) => {
	// Loop through every users
	for (const user of users) {
		// Checks if an user includes the authUserId in the blocked array.
		if (user.blockedUsers.includes(authUser._id)) {
			// Get every post where posterId !== user._id.
			// And where posterId is not in authUser blocked array (can be empty).
			const comments = await CommentModel.find({
				$and: [
					{ commenterId: { $ne: user._id } },
					{
						commenterId: { $nin: authUser.blockedUsers },
					},
					{ postId: req.query.postId },
				],
			})
				.populate("commenterId", "userName lastName firstName")
				.exec();

			return comments;
		}
	}
};
