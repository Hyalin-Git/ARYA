const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
	{
		posterId: {
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
		reactions: {
			love: { type: [String] },
			surprised: { type: [String] },
			funny: { type: [String] },
			sad: { type: [String] },
		},
		commentsLength: {
			type: Number,
			default: 0,
		},
		repostsLength: {
			type: Number,
			default: 0,
		},
		scheduledSendTime: {
			type: Date,
		},
		status: {
			type: String,
			default: "scheduled",
			required: true,
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

module.exports = mongoose.model("Post", PostSchema);
