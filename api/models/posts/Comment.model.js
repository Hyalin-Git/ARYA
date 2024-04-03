const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
	{
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		repostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Repost",
		},
		commenterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		media: {
			type: [String],
		},
		reactions: {
			love: { type: [String] },
			funny: { type: [String] },
			surprised: { type: [String] },
			sad: { type: [String] },
		},
		answersLength: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Comment", CommentSchema);
