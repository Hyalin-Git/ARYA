const mongoose = require("mongoose");

const freelanceSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
			required: true,
		},
		cv: { type: String },
		portfolio: { type: String },
		activity: { type: String },
		lookingForJob: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Freelance", freelanceSchema);
