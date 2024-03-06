import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
export default function CodeSubmit({ state, setStep }) {
	const { pending } = useFormStatus();

	useEffect(() => {
		if (state?.isSuccess) {
			document.getElementById("step-2").style.display = "none";
			document.getElementById("step-3").style.display = "block";
			setStep(3);
		}
	}, [state]);

	return (
		<button className={clsx(montserrat.className, pending && "loading")}>
			{pending ? "Vérification en cours" : "Vérifier le code"}
		</button>
	);
}
