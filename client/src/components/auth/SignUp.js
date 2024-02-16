import styles from "@/styles/components/auth/signUp.module.css";
import { createUser } from "@/actions/auth";
import Steps from "./Steps";

export default function SignUp({ setIsSignUp, setIsSignIn, step, setStep }) {
	function handleSignIn() {
		setIsSignUp(false);
		setIsSignIn(true);
	}

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<form action={createUser}>
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
		</div>
	);
}
