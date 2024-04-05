const mongoose = require("mongoose");

const RepostSchema = mongoose.Schema(
	{
		reposterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			trim: true,
		},
		media: {
			type: [String],
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		reactions: {
			love: { type: [String] },
			funny: { type: [String] },
			surprised: { type: [String] },
			sad: { type: [String] },
		},
		commentsLength: {
			type: Number,
			default: 0,
		},
		reported: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Repost", RepostSchema);
