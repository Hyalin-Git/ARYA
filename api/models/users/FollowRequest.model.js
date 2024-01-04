const mongoose = require("mongoose");

const followRequestSchema = mongoose.Schema(
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
		status: {
			type: String,
			enum: ["pending", "accepted"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("FollowRequest", followRequestSchema);
