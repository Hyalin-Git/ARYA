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
		},
		media: {
			type: [String],
		},
		gif: {
			type: String,
		},
		reactions: {
			love: { type: [String] },
			funny: { type: [String] },
			surprised: { type: [String] },
			sad: { type: [String] },
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
