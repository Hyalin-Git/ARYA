import styles from "@/styles/components/auth/forgotPassword.module.css";
import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { updatePasswordValidation } from "@/libs/utils";
export default function NewPassSubmit({ state }) {
	const { pending } = useFormStatus();
	function handleBtn(e) {
		const isValidate = updatePasswordValidation();
		if (!isValidate) {
			e.preventDefault();
		}
	}
	return (
		<>
			{!pending && (
				<>
					{state?.isFailure && (
						<div className={styles.failure}>
							<i>{state?.message}</i>
							<br />
							<br />
						</div>
					)}
				</>
			)}
			<button
				onClick={handleBtn}
				className={clsx(montserrat.className, pending && "loading")}>
				{pending
					? "Réinitialisation en cours"
					: "Réinitialiser mon mot de passe"}
			</button>
		</>
	);
}
