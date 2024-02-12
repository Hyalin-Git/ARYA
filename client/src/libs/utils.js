import styles from "@/styles/components/auth/userStep.module.css";
import { regex } from "./regex";
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

	if (!lookingForEmployeesYes.checked && !lookingForEmployeesNo.checked) {
		return false;
	}

	return true;
};
