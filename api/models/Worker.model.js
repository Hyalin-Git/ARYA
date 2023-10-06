const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema(
	{
		workerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
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
