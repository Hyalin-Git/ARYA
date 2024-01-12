const mongoose = require("mongoose");

const notificationSchema = mongoose.model({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	type: {
		type: String,
		enum: ["social", "company"],
	},
	urlId: {
		type: mongoose.Schema.Types.ObjectId,
	},
	picture: {
		type: String,
	},
	title: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	read: {
		type: Boolean,
		default: false,
	},
});
module.exports = mongoose.model("Notification", notificationSchema);
