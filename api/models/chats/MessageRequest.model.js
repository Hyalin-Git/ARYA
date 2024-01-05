const mongoose = require("mongoose");

const MessageRequestSchema = mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		messageContent: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["pending"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("MessageRequest", MessageRequestSchema);
