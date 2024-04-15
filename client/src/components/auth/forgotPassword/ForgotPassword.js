import styles from "@/styles/components/auth/forgotPassword.module.css";
import VerifyCodeStep from "./VerifyCodeStep";
import SendCodeStep from "./SendCodeStep";
import ModifyPasswordStep from "./ModifyPasswordStep";

export default function ForgotPassword({
	setIsSignIn,
	setIsForgotPassword,
	setStep,
}) {
	return (
		<div className={styles.container}>
			<div id="step-1" data-step="1">
				<SendCodeStep
					setIsSignIn={setIsSignIn}
					setIsForgotPassword={setIsForgotPassword}
					setStep={setStep}
				/>
			</div>
			<div id="step-2" data-step="2">
				<VerifyCodeStep setStep={setStep} />
			</div>
			<div id="step-3" data-step="3">
				<ModifyPasswordStep setStep={setStep} />
			</div>
		</div>
	);
}
