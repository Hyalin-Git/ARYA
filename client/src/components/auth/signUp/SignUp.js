import styles from "@/styles/components/auth/signUp.module.css";
import { createUser } from "@/actions/auth";
import { useFormState } from "react-dom";
import Steps from "./steps/Steps";
import SignUpSuccess from "./SignUpSuccess";

export default function SignUp({ setIsSignUp, setIsSignIn, step, setStep }) {
	const initialState = {
		isSuccess: "pending",
		message: "",
	};
	const [state, formAction] = useFormState(createUser, initialState);
	function handleSignIn() {
		setIsSignUp(false);
		setIsSignIn(true);
	}

	return (
		<div className={styles.container}>
			{state.isSuccess === "true" ? (
				<SignUpSuccess state={state} />
			) : (
				<div className={styles.form}>
					<form action={formAction}>
						<Steps step={step} setStep={setStep} />
					</form>
					<br />
					{step === 1 && (
						<div className={styles.text}>
							<p>
								Vous avez déjà un compte ?{" "}
								<span onClick={handleSignIn}>Se connecter</span>
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
