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
		userName: {
			type: String,
			unique: true,
			minLength: 1,
			maxLength: 35,
			required: "Un nom d'utilisateur est requis",
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
		biographie: {
			type: String,
			maxLength: 350,
		},
		phone: {
			type: String,
			unique: true,
			minLength: 4,
			maxLength: 20,
			required: "Un numéro de téléphone est requis",
		},
		picture: {
			type: String,
		},
		dateOfBirth: {
			type: String,
			required: "Date de naissance requise",
		},
		likes: {
			type: [String],
		},
		company: {
			type: Boolean,
			default: false,
		},
		worker: {
			type: Boolean,
			default: false,
		},
		subscription: {
			type: String,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		TwoFactorAuth: {
			type: Boolean,
			default: false,
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
