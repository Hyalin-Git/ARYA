import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
export default function Submit() {
	const { pending } = useFormStatus();
	return (
		<>
			<button
				className={clsx(montserrat.className, pending && "loading")}
				disabled={pending}
				type="submit">
				{pending ? "Envoi en cours" : "Envoyer le code"}
			</button>
		</>
	);
}
