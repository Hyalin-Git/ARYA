import { montserrat } from "@/libs/fonts";
import { signInValidation } from "@/libs/utils";
import clsx from "clsx";
import { useFormStatus } from "react-dom";

export default function Submit() {
	const { pending } = useFormStatus();

	function handleLogin(e) {
		const isValidate = signInValidation();
		if (!isValidate) {
			e.preventDefault();
			return;
		}
	}
	return (
		<button
			type="submit"
			onClick={handleLogin}
			className={clsx(montserrat.className, pending && "loading")}
			disabled={pending}>
			{pending ? "Connexion en cours..." : "Accéder à mon compte"}
		</button>
	);
}
