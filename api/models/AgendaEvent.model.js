const mongoose = require("mongoose");

export const AgendaSchema = mongoose.Schema({
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
	deadline: {
		type: String,
	},
	software: {
		type: [String],
	},
	startingDate: {
		type: Date,
	},
	endingDate: {
		type: Date,
	},
});
