import { verifyResetPasswordCode } from "@/actions/verifications";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/auth/forgotPassword.module.css";
import clsx from "clsx";
import { useFormState } from "react-dom";
import CodeSubmit from "../CodeSubmit";
export default function VerifyCodeStep({ setStep }) {
	const initialState = {
		isFailure: false,
		isSuccess: false,
		message: "",
	};
	const [state, formAction] = useFormState(
		verifyResetPasswordCode,
		initialState
	);
	return (
		<>
			<div className={styles.titles}>
				<h1>Validez votre code de réinitialisation</h1>
				<h2>Entrez votre code de réinitialisation</h2>
			</div>
			<div className={styles.form}>
				<form action={formAction}>
					<div className={styles.labels}>
						<div>
							<label htmlFor="code">Code de réinitialisation</label>
						</div>
						<div>
							<i className={styles.errorMsg}></i>
						</div>
					</div>
					<input
						className={clsx(montserrat.className, styles.email)}
						type="text"
						name="code"
						id="code"
						placeholder="Code de réinitialisation"
					/>
					<br />
					<br />
					<CodeSubmit state={state} setStep={setStep} />
				</form>
			</div>
		</>
	);
}
