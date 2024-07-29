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
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: "Une adresse mail est requise",
			validate: [validateEmail, "Veuillez entrer une adresse mail valide"],
			trim: true,
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
			default: "Salut ! Je suis nouveau ici sur Arya",
		},
		picture: {
			type: String,
		},
		dateOfBirth: {
			type: String,
		},
		interest: {
			type: [String],
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
		freelance: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Freelance",
		},
		website: {
			type: String,
			trim: true,
		},
		job: {
			type: String,
			trim: true,
		},
		contact: {
			type: String,
			lowercase: true,
			validate: [validateEmail, "Veuillez entrer une adresse mail valide"],
			trim: true,
		},
		lookingForJob: {
			type: Boolean,
			default: false,
		},
		social: {
			type: {
				twitter: {
					type: String,
				},
				tiktok: {
					type: String,
				},
				instagram: {
					type: String,
				},
				facebook: {
					type: String,
				},
				linkedIn: {
					type: String,
				},
				youtube: {
					type: String,
				},
				twitch: {
					type: String,
				},
			},
		},
		tools: {
			type: [String],
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
		status: {
			isConnected: {
				type: Boolean,
				default: false,
			},
			socketId: { type: String },
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
