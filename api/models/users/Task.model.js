const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
		},
		software: {
			type: [String],
		},
		customers: {
			type: [String],
		},
		startingDate: {
			type: Date,
		},
		endingDate: {
			type: Date,
		},
		status: {
			type: String,
			default: "En cours",
		},
		priority: {
			type: Number,
			max: 3,
		},
		devisLink: {
			type: String,
		},
		factureLink: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Task", TaskSchema);
