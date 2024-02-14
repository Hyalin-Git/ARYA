import styles from "@/styles/components/auth/userStep.module.css";
import { regex } from "./regex";

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

	if (!regex.email.test(email.value)) {
		email.classList.add(styles.error);
		email.value = "";
		email.setAttribute("placeholder", "Adresse mail invalide");
		setTimeout(() => {
			email.classList.remove(styles.error);
			email.setAttribute("placeholder", "exemple@email.com");
		}, 2000);
		return false;
	}

	// passwords
	if (!regex.password.pass.test(password.value)) {
		password.classList.add(styles.error);

		let placeHolderMsg = "";

		if (password.value.length < 8) {
			placeHolderMsg = "Au moins 8 caractères";
		} else if (password.value.search(regex.password.hasLowerCase)) {
			placeHolderMsg = "Au moins une minuscule";
		} else if (password.value.search(regex.password.hasUpperCase)) {
			placeHolderMsg = "Au moins une majuscule";
		} else if (password.value.search(regex.password.hasDigit)) {
			placeHolderMsg = "Doit contenir un chiffre";
		} else if (password.value.search(regex.password.hasSymbol)) {
			placeHolderMsg = "Doit contenir un symbol (!@#$)";
		}

		password.value = "";
		password.setAttribute("placeholder", placeHolderMsg);
		setTimeout(() => {
			password.classList.remove(styles.error);
			password.setAttribute("placeholder", "Au moins 8 caractères");
		}, 2000);
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
		lastname.value = "";
		lastname.setAttribute("placeholder", "Nom invalide");
		setTimeout(() => {
			lastname.classList.remove(styles.error);
			lastname.setAttribute("placeholder", "Nom");
		}, 2000);
		return false;
	}

	if (!regex.names.test(firstname.value)) {
		firstname.classList.add(styles.error);
		firstname.value = "";
		firstname.setAttribute("placeholder", "Prénom invalide");
		setTimeout(() => {
			firstname.classList.remove(styles.error);
			firstname.setAttribute("placeholder", "Prénom");
		}, 2000);
		return false;
	}

	if (!regex.userName.test(username.value)) {
		username.classList.add(styles.error);
		username.value = "";
		username.setAttribute("placeholder", "Nom d'utilisateur invalide");
		setTimeout(() => {
			username.classList.remove(styles.error);
			username.setAttribute("placeholder", "utilisateur");
		}, 2000);
		return false;
	}

	if (!regex.email.test(email.value)) {
		email.classList.add(styles.error);
		email.value = "";
		email.setAttribute("placeholder", "Adresse mail invalide");
		setTimeout(() => {
			email.classList.remove(styles.error);
			email.setAttribute("placeholder", "exemple@email.com");
		}, 2000);
		return false;
	}

	// passwords
	if (!regex.password.pass.test(password.value)) {
		password.classList.add(styles.error);

		let placeHolderMsg = "";

		if (password.value.length < 8) {
			placeHolderMsg = "Au moins 8 caractères";
		} else if (password.value.search(regex.password.hasLowerCase)) {
			placeHolderMsg = "Au moins une minuscule";
		} else if (password.value.search(regex.password.hasUpperCase)) {
			placeHolderMsg = "Au moins une majuscule";
		} else if (password.value.search(regex.password.hasDigit)) {
			placeHolderMsg = "Doit contenir un chiffre";
		} else if (password.value.search(regex.password.hasSymbol)) {
			placeHolderMsg = "Doit contenir un symbol (!@#$)";
		} else {
			placeHolderMsg = "Mot de passe invalide";
		}

		password.value = "";
		password.setAttribute("placeholder", placeHolderMsg);
		setTimeout(() => {
			password.classList.remove(styles.error);
			password.setAttribute("placeholder", "Au moins 8 caractères");
		}, 2000);
		return false;
	}

	// If password & newPassword aren't the same
	if (newPassword.value !== password.value) {
		newPassword.classList.add(styles.error);
		newPassword.value = "";
		newPassword.setAttribute("placeholder", "Le mot de passe est différent");
		setTimeout(() => {
			newPassword.classList.remove(styles.error);
			newPassword.setAttribute("placeholder", "Confirmez votre mot de passe");
		}, 2000);
		return false;
	}

	return true;
};

export const accountTypeValidation = () => {
	const company = document.getElementById("company");
	const freelance = document.getElementById("freelance");
	const other = document.getElementById("other");

	if (!company.checked && !freelance.checked && !other.checked) {
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
		name.value = "";
		name.setAttribute("placeholder", "Nom de l'entreprise invalide");
		setTimeout(() => {
			name.classList.remove(styles.error);
			name.setAttribute("placeholder", "Nom de l'entreprise");
		}, 2000);
		return false;
	}

	if (logo.files.length >= 1) {
		if (!allowedMimetypes.includes(logo.files[0]?.type)) {
			logo.parentElement.classList.add(styles.error);
			logo.value = "";
			document.getElementById("fileName").innerHTML = ".png / .jpg";
			document.getElementById("fileName").style.color = "red";
			setTimeout(() => {
				logo.parentElement.classList.remove(styles.error);
				document.getElementById("fileName").style.color = "grey";
			}, 2000);
			return false;
		}
	}

	if (activity.value === "") {
		activity.classList.add(styles.error);
		setTimeout(() => {
			activity.classList.remove(styles.error);
		}, 2000);
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
			cv.value = "";
			document.getElementById("fileName").innerHTML = ".pdf";
			document.getElementById("fileName").style.color = "red";
			setTimeout(() => {
				cv.parentElement.classList.remove(styles.error);
				document.getElementById("fileName").style.color = "grey";
			}, 2000);
			return false;
		}
	}

	if (portfolio.value.length >= 1) {
		if (!regex.link.test(portfolio)) {
			portfolio.classList.add(styles.error);
			portfolio.value = "";
			portfolio.setAttribute("placeholder", "Ceci n'est pas un lien valide");
			setTimeout(() => {
				portfolio.classList.remove(styles.error);
				portfolio.setAttribute("placeholder", "https://portfolio.fr");
			}, 2000);
			return false;
		}
	}

	if (activity.value === "") {
		activity.classList.add(styles.error);
		setTimeout(() => {
			activity.classList.remove(styles.error);
		}, 2000);
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
