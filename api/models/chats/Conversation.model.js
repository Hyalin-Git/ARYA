const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		isGroup: {
			type: Boolean,
			default: false,
		},
		users: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		messages: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Message",
		},
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);


module.exports = mongoose.model("Conversation", conversationSchema);
