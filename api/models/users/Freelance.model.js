const mongoose = require("mongoose");

const freelanceSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
			required: true,
		},
		cv: {
			type: {
				pdf: {
					type: String,
				},
				private: {
					type: Boolean,
					default: false,
				},
			},
		},
		lookingForJob: { type: Boolean },
		availability: { type: Date },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Freelance", freelanceSchema);
