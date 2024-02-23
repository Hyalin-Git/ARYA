import styles from "@/styles/components/auth/forgotPassword.module.css";

import VerifyCodeStep from "./steps/VerifyCodeStep";
import SendCodeStep from "./steps/SendCodeStep";
import ModifyPasswordStep from "./steps/ModifyPasswordStep";

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
