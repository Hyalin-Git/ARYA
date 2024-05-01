import styles from "@/styles/components/auth/userStep.module.css";
import { regex } from "./regex";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work

// Form validation for sign in

export const signInValidation = () => {
	const email = document.getElementById("email");
	const password = document.getElementById("password");
	const inputs = [email, password];

	for (const input of inputs) {
		if (input.value.length <= 0) {
			input.classList.add(styles.error);
			setTimeout(() => {
				input.classList.remove(styles.error);
			}, 2000);
			return false;
		}
	}

	// Email
	if (!regex.email.test(email.value)) {
		email.classList.add(styles.error);
		document.getElementById("email-error").innerHTML =
			"Cette adresse mail est invalide";

		email.addEventListener("input", function () {
			email.classList.remove(styles.error);
			document.getElementById("email-error").innerHTML = "";
		});
		return false;
	}

	// passwords
	if (!regex.password.pass.test(password.value)) {
		password.classList.add(styles.error);
		let msg = "";
		if (password.value.length < 8) {
			msg = "Au moins 8 caractères";
		} else if (password.value.search(regex.password.hasLowerCase)) {
			msg = "Au moins une minuscule";
		} else if (password.value.search(regex.password.hasUpperCase)) {
			msg = "Au moins une majuscule";
		} else if (password.value.search(regex.password.hasDigit)) {
			msg = "Doit contenir un chiffre";
		} else if (password.value.search(regex.password.hasSymbol)) {
			msg = "Doit contenir un symbol (!@#$)";
		} else {
			msg = "Mot de passe invalide";
		}

		document.getElementById("password-error").innerHTML = msg;
		password.addEventListener("input", function () {
			password.classList.remove(styles.error);
			document.getElementById("password-error").innerHTML = "";
		});

		return false;
	}
	return true;
};

// Form validation for account creation

export const userStepValidation = () => {
	const lastname = document.getElementById("lastname");
	const firstname = document.getElementById("firstname");
	const username = document.getElementById("username");
	const email = document.getElementById("email");
	const password = document.getElementById("password");
	const newPassword = document.getElementById("newPassword");

	const inputs = [lastname, firstname, username, email, password, newPassword];

	for (const input of inputs) {
		if (input.value.length <= 0) {
			input.classList.add(styles.error);
			setTimeout(() => {
				input.classList.remove(styles.error);
			}, 2000);
			return false;
		}
	}

	if (!regex.names.test(lastname.value)) {
		lastname.classList.add(styles.error);
		document.getElementById("lastname-error").innerHTML = "Nom invalide";

		lastname.addEventListener("input", function () {
			document.getElementById("lastname-error").innerHTML = "";
		});
		return false;
	}

	if (!regex.names.test(firstname.value)) {
		firstname.classList.add(styles.error);
		document.getElementById("firstname-error").innerHTML = "Prénom invalide";

		firstname.addEventListener("input", function () {
			document.getElementById("firstname-error").innerHTML = "";
		});
		return false;
	}

	if (!regex.userName.test(username.value)) {
		username.classList.add(styles.error);
		document.getElementById("username-error").innerHTML =
			"Ce nom d'utilisateur est invalide";

		username.addEventListener("input", function () {
			document.getElementById("username-error").innerHTML = "";
		});
		return false;
	}

	if (!regex.email.test(email.value)) {
		email.classList.add(styles.error);
		document.getElementById("email-error").innerHTML =
			"Cette adresse mail est invalide";

		email.addEventListener("input", function () {
			document.getElementById("email-error").innerHTML = "";
		});
		return false;
	}

	// passwords
	if (!regex.password.pass.test(password.value)) {
		password.classList.add(styles.error);
		let msg = "";
		if (password.value.length < 8) {
			msg = "Au moins 8 caractères";
		} else if (password.value.search(regex.password.hasLowerCase)) {
			msg = "Au moins une minuscule";
		} else if (password.value.search(regex.password.hasUpperCase)) {
			msg = "Au moins une majuscule";
		} else if (password.value.search(regex.password.hasDigit)) {
			msg = "Doit contenir un chiffre";
		} else if (password.value.search(regex.password.hasSymbol)) {
			msg = "Doit contenir un symbol (!@#$)";
		} else {
			msg = "Mot de passe invalide";
		}

		document.getElementById("password-error").innerHTML = msg;
		password.addEventListener("input", function () {
			document.getElementById("password-error").innerHTML = "";
		});

		return false;
	}

	// If password & newPassword aren't the same
	if (newPassword.value !== password.value) {
		newPassword.classList.add(styles.error);
		document.getElementById("newPassword-error").innerHTML =
			"Mot de passe différent";

		newPassword.addEventListener("input", function () {
			document.getElementById("newPassword-error").innerHTML = "";
		});
		return false;
	}

	return true;
};

export const accountTypeValidation = () => {
	const company = document.getElementById("company");
	const freelance = document.getElementById("freelance");
	const other = document.getElementById("other");

	if (!company.checked && !freelance.checked && !other.checked) {
		company.parentElement.classList.add(styles.error);
		freelance.parentElement.classList.add(styles.error);
		other.parentElement.classList.add(styles.error);
		setTimeout(() => {
			company.parentElement.classList.remove(styles.error);
			freelance.parentElement.classList.remove(styles.error);
			other.parentElement.classList.remove(styles.error);
		}, 2000);
		return false;
	}

	return true;
};

export const companyStepValidation = () => {
	const name = document.getElementById("name");
	const logo = document.getElementById("logo");
	const activity = document.getElementById("activity");
	const lookingForEmployeesYes = document.getElementById(
		"lookingForEmployeesYes"
	);
	const lookingForEmployeesNo = document.getElementById(
		"lookingForEmployeesNo"
	);
	const allowedMimetypes = ["image/png", "image/jpg", "image/jpeg"];

	if (name.value.length <= 0) {
		name.classList.add(styles.error);
		setTimeout(() => {
			name.classList.remove(styles.error);
		}, 2000);
		return false;
	}

	if (!regex.company.test(name.value)) {
		name.classList.add(styles.error);
		document.getElementById("company-name-error").innerHTML =
			"Nom d'entreprise invalide";

		name.addEventListener("input", function () {
			name.classList.remove(styles.error);
			document.getElementById("company-name-error").innerHTML = "";
		});
		return false;
	}

	if (logo.files.length >= 1) {
		if (!allowedMimetypes.includes(logo.files[0]?.type)) {
			logo.parentElement.classList.add(styles.error);
			document.getElementById("file-error").innerHTML =
				"Ce type de fichier n'est pas accepté";

			logo.addEventListener("change", function () {
				logo.parentElement.classList.remove(styles.error);
				document.getElementById("file-error").innerHTML = "";
			});

			return false;
		}
	}

	if (activity.value === "") {
		activity.classList.add(styles.error);
		document.getElementById("activity-error").innerHTML =
			"L'activité choisie n'est pas valide";

		activity.addEventListener("change", function () {
			document.getElementById("activity-error").innerHTML = "";
			activity.classList.remove(styles.error);
		});
		return false;
	}

	if (!lookingForEmployeesYes.checked && !lookingForEmployeesNo.checked) {
		lookingForEmployeesYes.parentElement.classList.add(styles.error);
		lookingForEmployeesNo.parentElement.classList.add(styles.error);
		setTimeout(() => {
			lookingForEmployeesYes.parentElement.classList.remove(styles.error);
			lookingForEmployeesNo.parentElement.classList.remove(styles.error);
		}, 2000);
		return false;
	}

	return true;
};

export const freelanceStepValidation = () => {
	const cv = document.getElementById("cv");
	const portfolio = document.getElementById("portfolio");
	const activity = document.getElementById("activity");
	const lookingForJobYes = document.getElementById("lookingForJobYes");
	const lookingForJobNo = document.getElementById("lookingForJobNo");
	const allowedMimetypes = ["application/pdf"];

	if (cv.files.length >= 1) {
		if (!allowedMimetypes.includes(cv.files[0]?.type)) {
			cv.parentElement.classList.add(styles.error);
			document.getElementById("file-error").innerHTML =
				"Ce type de fichier n'est pas accepté";

			cv.addEventListener("change", function () {
				cv.parentElement.classList.remove(styles.error);
				document.getElementById("file-error").innerHTML = "";
			});

			return false;
		}
		return false;
	}

	if (portfolio.value.length >= 1) {
		if (!regex.link.test(portfolio)) {
			portfolio.classList.add(styles.error);
			document.getElementById("portfolio-error").innerHTML =
				"Ceci n'est pas un lien valide";

			portfolio.addEventListener("input", function () {
				portfolio.classList.remove(styles.error);
				document.getElementById("portfolio-error").innerHTML = "";
			});

			return false;
		}
	}

	if (activity.value === "") {
		activity.classList.add(styles.error);
		document.getElementById("activity-error").innerHTML =
			"L'activité choisie n'est pas valide";

		activity.addEventListener("change", function () {
			document.getElementById("activity-error").innerHTML = "";
			activity.classList.remove(styles.error);
		});
		return false;
	}

	if (!lookingForJobYes.checked && !lookingForJobNo.checked) {
		lookingForJobYes.parentElement.classList.add(styles.error);
		lookingForJobNo.parentElement.classList.add(styles.error);
		setTimeout(() => {
			lookingForJobYes.parentElement.classList.remove(styles.error);
			lookingForJobNo.parentElement.classList.remove(styles.error);
		}, 2000);
		return false;
	}

	return true;
};

export const updatePasswordValidation = () => {
	const newPassword = document.getElementById("newPassword");
	const confirmNewPassword = document.getElementById("confirmNewPassword");
	const inputs = [newPassword, confirmNewPassword];

	for (const input of inputs) {
		if (input.value.length <= 0) {
			input.classList.add(styles.error);
			setTimeout(() => {
				input.classList.remove(styles.error);
			}, 2000);
			return false;
		}
	}

	// passwords
	if (!regex.password.pass.test(newPassword.value)) {
		newPassword.classList.add(styles.error);
		let msg = "";
		if (newPassword.value.length < 8) {
			msg = "Au moins 8 caractères";
		} else if (newPassword.value.search(regex.password.hasLowerCase)) {
			msg = "Au moins une minuscule";
		} else if (newPassword.value.search(regex.password.hasUpperCase)) {
			msg = "Au moins une majuscule";
		} else if (newPassword.value.search(regex.password.hasDigit)) {
			msg = "Doit contenir un chiffre";
		} else if (newPassword.value.search(regex.password.hasSymbol)) {
			msg = "Doit contenir un symbol (!@#$)";
		} else {
			msg = "Mot de passe invalide";
		}

		document.getElementById("newPassword-error").innerHTML = msg;
		newPassword.addEventListener("input", function () {
			newPassword.classList.remove(styles.error);
			document.getElementById("newPassword-error").innerHTML = "";
		});

		return false;
	}

	// If password & newPassword aren't the same
	if (newPassword.value !== confirmNewPassword.value) {
		confirmNewPassword.classList.add(styles.error);
		document.getElementById("confirmNewPassword-error").innerHTML =
			"Mot de passe différent";

		confirmNewPassword.addEventListener("input", function () {
			confirmNewPassword.classList.remove(styles.error);
			document.getElementById("confirmNewPassword-error").innerHTML = "";
		});
		return false;
	}

	return true;
};

// S O C I A L //

export function formattedDate(element) {
	const date = moment
		.utc(element?.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
		.locale("fr")
		.fromNow();

	if (date === "Invalid date") {
		return null;
	}

	return date;
}

export function reactionLength(element) {
	const length =
		element?.reactions?.love.length +
		element?.reactions?.funny.length +
		element?.reactions?.surprised.length +
		element?.reactions?.sad.length;

	return length;
}

export function hasReacted(reactions, uid) {
	return Object.values(reactions).some((reaction) => reaction.includes(uid));
}

export function findUidReaction(reactions, uid) {
	let value;
	for (const property in reactions) {
		if (reactions[property].includes(uid)) {
			value = property;
			break;
		}
	}
	return value;
}

// Functions to get informations of the post/comment author
export function getAuthor(element, query) {
	let response;
	if (query === "firstname") {
		response =
			element?.posterId?.firstName ||
			element?.reposterId?.firstName ||
			element?.commenterId?.firstName ||
			element?.answererId?.firstName;
		return response;
	}
	if (query === "lastname") {
		response =
			element?.posterId?.lastName ||
			element?.reposterId?.lastName ||
			element?.commenterId?.lastName ||
			element?.answererId?.lastName;
		return response;
	}
	if (query === "username") {
		response =
			element?.posterId?.userName ||
			element?.reposterId?.userName ||
			element?.commenterId?.userName ||
			element?.answererId?.userName;
		return response;
	}
}

export function authorCheck(uid, element) {
	if (uid === element?.posterId?._id) {
		return true;
	}
	if (uid === element?.reposterId?._id) {
		return true;
	}
	if (uid === element?.commenterId?._id) {
		return true;
	}
	if (uid === element?.answererId?._id) {
		return true;
	}
	return false;
}

export function handleAddReaction() {}
