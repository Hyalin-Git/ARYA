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
