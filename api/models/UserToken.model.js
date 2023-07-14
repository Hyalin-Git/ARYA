const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, required: true },
		token: { type: String, required: true },

		createdAt: {
			type: Date,
			default: Date.now(),
			expires: 30 * 86400,
		},
	},

	{
		timestamps: true,
	}
);

// JwtSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("UserToken", UserTokenSchema);
