const mongoose = require("mongoose");

// checks email validity
const validateEmail = function (email) {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	regex.test(email);
};

const UserSchema = new mongoose.Schema(
	{
		lastName: {
			type: String,
			minLength: 1,
			maxLength: 35,
			required: "Un nom de famille est requis",
		},
		firstName: {
			type: String,
			minLength: 1,
			maxLength: 35,
			required: "Un prénom est requis",
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: "Une adresse mail est requise",
			validate: [validateEmail, "Veuillez entrer une adresse mail valide"],
		},
		password: {
			type: String,
			unique: true,
			trim: true,
			required: "Un mot de passe est requis",
		},
		phone: {
			type: String,
			unique: true,
			minLength: 4,
			maxLength: 16,
			required: "Un numéro de téléphone est requis",
		},
		// picture: {
		// 	type: String,
		// },
		dateOfBirth: {
			type: String,
			required: "Date de naissance requise sdzqdd",
		},
		activity: {
			type: String,
			required: "Veuillez sélectionner votre activité",
		},
		admin: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);
// Capitalize the first letter in case the user doesn't
function capitalizeFirstLetter(next) {
	function getString(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	this.lastName = getString(this.lastName);
	this.firstName = getString(this.firstName);

	next();
}

UserSchema.pre("save", capitalizeFirstLetter);

module.exports = mongoose.model("User", UserSchema);
