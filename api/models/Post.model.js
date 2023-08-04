const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		posterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		socialMedia: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		media: {
			type: String,
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
