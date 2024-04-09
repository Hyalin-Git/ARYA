import Image from "next/image";
import styles from "@/styles/components/aryaMedia/updateCard.module.css";
import { useFormState } from "react-dom";
import { updatePost } from "@/actions/post";
import { useEffect } from "react";
import { mutate } from "swr";
const initialState = {
	status: "pending",
	message: "",
};
export default function UpdateCard({ element, action, setIsUpdate }) {
	const [state, formAction] = useFormState(action, initialState);

	useEffect(() => {
		if (state.status === "success") {
			setIsUpdate(false);
			mutate(`api/comments?postId=${element.postId}`);
		}
	}, [state]);

	function cancelIsUpdate(e) {
		e.preventDefault();
		setIsUpdate(false);
	}
	return (
		<div className={styles.container}>
			<form action={formAction}>
				<div className={styles.text}>
					<textarea
						name="text"
						id="text"
						cols="30"
						rows="10"
						defaultValue={element?.text}></textarea>
				</div>
				<div className={styles.footer}>
					<ul>
						<li>
							<Image
								src="/images/icons/img_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</li>
						<li>
							{" "}
							<Image
								src="/images/icons/video_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</li>
						<li>
							{" "}
							<Image
								src="/images/icons/gif_icon.svg"
								width={20}
								height={20}
								alt="icon"
							/>
						</li>
					</ul>
					<div className={styles.buttons}>
						<button onClick={cancelIsUpdate}>Annuler</button>
						<button type="submit">Modifier</button>
					</div>
				</div>
			</form>
		</div>
	);
}
