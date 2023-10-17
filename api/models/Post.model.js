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
			required: true,
		},
		media: {
			type: [String],
		},
		reactions: {
			like: { type: [String] },
			awesome: { type: [String] },
			love: { type: [String] },
			funny: { type: [String] },
		},
		comments: {
			type: [
				{
					commenterId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					text: { type: String },
					timestamp: { type: Number },
				},
			],
		},
		scheduledSendTime: {
			type: Date,
		},
		status: { type: String, default: "scheduled", required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", PostSchema);
