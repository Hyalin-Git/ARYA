const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			trim: true,
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
		isEdited: {
			type: Boolean,
			default: false,
		},
		readBy: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
