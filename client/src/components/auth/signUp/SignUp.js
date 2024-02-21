import styles from "@/styles/components/auth/signUp.module.css";
import { createUser } from "@/actions/auth";
import { useFormState } from "react-dom";
import Steps from "./steps/Steps";
import SignUpSuccess from "./SignUpSuccess";
import SignUpFailure from "./SignUpFailure";

export default function SignUp({ setIsSignUp, setIsSignIn, step, setStep }) {
	const initialState = {
		isSuccess: false,
		isFailure: false,
		status: "pending",
		isLastname: false,
		isFirstname: false,
		isUsername: false,
		isEmail: false,
		isPassword: false,
		message: "",
	};
	const [state, formAction] = useFormState(createUser, initialState);
	function handleSignIn() {
		setIsSignUp(false);
		setIsSignIn(true);
	}

	return (
		<div className={styles.container}>
			{state.status === "pending" ? (
				<div className={styles.form}>
					<form action={formAction}>
						<Steps state={state} step={step} setStep={setStep} />
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
			) : (
				<>
					{state.isSuccess && <SignUpSuccess state={state} />}
					{state.isFailure && <SignUpFailure state={state} setStep={setStep} />}
				</>
			)}
		</div>
	);
}
