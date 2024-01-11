const mongoose = require("mongoose");

const compagnyRequestSchema = mongoose.Schema(
	{
        
    },
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("CompanyRequest", compagnyRequestSchema);
