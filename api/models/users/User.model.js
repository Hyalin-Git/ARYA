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
		following: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		followers: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
		},
		worker: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Worker",
		},
		lookingForJob: {
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
		twoFactor: {
			otp_enabled: { type: Boolean, default: false },
			otp_verified: { type: Boolean, default: false },
			otp_hex: { type: String },
			otp_auth_url: { type: String },
		},
		blockedUsers: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		reported: {
			type: Number,
			default: 0,
		},
		admin: {
			type: Boolean,
			default: false,
		},
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
