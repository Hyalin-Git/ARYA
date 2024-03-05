import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useFormStatus } from "react";

export default function SignUpSuccessSubmit({ timer, setTimer }) {
	return (
		<button
			type="submit"
			onClick={(e) => {
				// if (timer !== 0) {
				// 	e.preventDefault();
				// } else {
				// 	setTimer(30);
				// }
				console.log(document.getElementById("email").value);
			}}
			className={clsx(montserrat.className, timer !== 0 && "loading")}>
			{timer !== 0 ? `${timer}` : "Renvoyez un mail de vérification"}
		</button>
	);
}
