const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema(
	{
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
