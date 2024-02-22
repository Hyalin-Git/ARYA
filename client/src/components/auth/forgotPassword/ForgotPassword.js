import styles from "@/styles/components/auth/forgotPassword.module.css";
import Submit from "./Submit";
import clsx from "clsx";
import { montserrat } from "@/libs/fonts";
import { useFormState } from "react-dom";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPassword({ setIsSignIn, setIsForgotPassword }) {
	const initialState = {
		isFailure: false,
		isSuccess: false,
		message: "",
	};
	const [state, formAction] = useFormState(forgotPassword, initialState);
	function handleSignIn() {
		setIsForgotPassword(false);
		setIsSignIn(true);
	}

	console.log(state.message);
	return (
		<div className={styles.container}>
			<div className={styles.titles}>
				<h1>Vous avez oublié votre mot de passe ?</h1>
				<h2>Entrez votre adresse mail pour le modifier</h2>
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<div className={styles.labels}>
						<div>
							<label htmlFor="email">Adresse mail</label>
						</div>
						<div>
							<i className={styles.errorMsg}></i>
						</div>
					</div>
					<input
						className={clsx(montserrat.className, styles.email)}
						type="email"
						name="email"
						id="email"
						placeholder="example@email.com"
					/>
					<br />
					<br />
					<Submit state={state} />
				</form>
			</div>
			<div className={styles.text}>
				<p>
					Ah ! Ça vous revient ?{" "}
					<span onClick={handleSignIn}>Se connecter</span>
				</p>
			</div>
		</div>
	);
}
