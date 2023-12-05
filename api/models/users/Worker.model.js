const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
			required: true,
		},
		cv: { type: Buffer },
		portfolio: { type: String },
		business: { type: String },
		lookingForJob: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Worker", WorkerSchema);
