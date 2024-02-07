import styles from "@/styles/components/auth/signUp.module.css";
import { createUser } from "@/actions/auth";
import Steps from "./Steps";
import StepTracker from "./StepTracker";

export default function SignUp({ setIsSignUp, setIsSignIn, step, setStep }) {
	function handleSignIn() {
		setIsSignUp(false);
		setIsSignIn(true);
	}
	return (
		<div className={styles.container}>
			<div className={styles.tracker}>
				<StepTracker step={step} />
			</div>
			<div className={styles.form}>
				<form action={createUser}>
					<Steps setStep={setStep} />
				</form>
				<br />
				<div className={styles.text}>
					<p>
						Vous avez déjà un compte ?{" "}
						<span onClick={handleSignIn}>Se connecter</span>
					</p>
				</div>
			</div>
		</div>
	);
}
