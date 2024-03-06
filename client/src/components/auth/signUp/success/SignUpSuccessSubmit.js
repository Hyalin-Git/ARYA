import { montserrat } from "@/libs/fonts";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

export default function SignUpSuccessSubmit({ newState }) {
	const [timer, setTimer] = useState(0);
	const { pending } = useFormStatus();
	console.log(newState);
	useEffect(() => {
		let interval;

		if (newState?.isSuccess) {
			interval = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
			if (timer === 0) {
				clearTimeout(interval);
			}
		}
		if (newState?.isFailure) {
			setTimer(0);
			return;
		}
	}, [newState, timer]);
	console.log(timer);
	return (
		<button
			type="submit"
			onClick={(e) => {
				if (timer !== 0) {
					e.preventDefault();
				} else {
					setTimer(30);
				}
			}}
			className={clsx(
				montserrat.className,
				(pending || (newState.isSuccess && timer !== 0)) && "loading"
			)}
			disabled={pending}>
			{pending
				? "Envoi en cours"
				: newState.isSuccess && timer !== 0
				? `${timer}`
				: "Renvoyez un mail de confirmation"}
		</button>
	);
}
