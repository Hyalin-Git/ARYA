const { regex } = require("../utils/RegexPatterns/regex");

exports.signUpValidation = (req) => {
	let isValid = true;
	let message = "";

	switch (false) {
		case regex.names.test(req.body.lastName || req.body.firstName):
			isValid = false;
			// Names are invalid
			message = "Votre nom ou prénom est invalide";
			break;
		case regex.userName.test(req.body.userName):
			isValid = false;
			// Email is invalid
			message =
				"Votre nom d'utilisateur ne peut pas contenir d'espaces, de symboles ou de caractères spéciaux autres que le tiret bas (_).";
			break;
		case regex.email.test(req.body.email):
			isValid = false;
			// Email is invalid
			message = "Votre adresse mail est invalide";
			break;
		case regex.password.test(req.body.password):
			isValid = false;
			// Password should contain at least 8 character, 1 number, 1 uppercase, 1 lowercase
			message =
				"Votre mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule et un symbol (!#@)";
			break;
		case regex.phone.test(req.body.phone):
			isValid = false;
			// Phone is invalid
			message = "Votre numéro de téléphone est invalide";
			break;
		case regex.dateOfBirth.test(req.body.dateOfBirth):
			isValid = false;
			// Date of birth is invalid
			message = "Votre date de naissance n'est pas valide";
			break;
		default:
			// Please fill in the form fields
			message = "Veuillez remplir les champs du formulaire";
			break;
	}

	return { isValid, message };
};

exports.signInValidation = (req) => {
	let isValid = true;
	let message = "";

	switch (false) {
		case regex.email.test(req.body.email):
			isValid = false;
			// Email is invalid
			message = "Adresse mail est invalide";
			break;
		case regex.password.test(req.body.password):
			isValid = false;
			// Password should contain at least 8 character, 1 number, 1 uppercase, 1 lowercase
			message =
				"Le mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule et un symbol (!#@)";
			break;
		default:
			// Please fill in the form fields
			message = "Veuillez remplir les champs du formulaire";
			break;
	}

	return { isValid, message };
};
