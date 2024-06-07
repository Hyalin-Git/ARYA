"use client";
import { updateUserSocial } from "@/actions/user";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/socialEditor.module.css";
import Image from "next/image";
import { useContext } from "react";
import { useFormState } from "react-dom";

const initialState = {
	status: "pending",
	message: "",
};
export default function SocialEditor() {
	const { user, uid } = useContext(AuthContext);
	const updateUserSocialWithUid = updateUserSocial.bind(null, uid);
	const [state, formAction] = useFormState(
		updateUserSocialWithUid,
		initialState
	);

	return (
		<div className={styles.container} id="panel">
			<div className={styles.title}>
				<span>Réseau social</span>
			</div>
			<form action={formAction}>
				<div className={styles.form}>
					<div>
						<label htmlFor="twitter">
							<Image
								src="/images/icons/x_icon.svg"
								alt="icon"
								width={30}
								height={28}
							/>
						</label>
						<input
							type="text"
							name="twitter"
							id="twitter"
							className={montserrat.className}
							defaultValue={user?.social?.twitter}
						/>
					</div>
					<div>
						<label htmlFor="tiktok">
							<Image
								src="/images/icons/tiktok_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>
						</label>
						<input
							type="text"
							name="tiktok"
							id="tiktok"
							className={montserrat.className}
							defaultValue={user?.social?.tiktok}
						/>
					</div>
					<div>
						<label htmlFor="instagram">
							<Image
								src="/images/icons/instagram_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>
						</label>
						<input
							type="text"
							name="instagram"
							id="instagram"
							className={montserrat.className}
							defaultValue={user?.social?.instagram}
						/>
					</div>
					<div>
						<label htmlFor="facebook">
							<Image
								src="/images/icons/facebook_icon.svg"
								alt="icon"
								width={30}
								height={28}
							/>
						</label>
						<input
							type="text"
							name="facebook"
							id="facebook"
							className={montserrat.className}
							defaultValue={user?.social?.facebook}
						/>
					</div>
					<div>
						<label htmlFor="linkedIn">
							<Image
								src="/images/icons/linkedIn_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>
						</label>
						<input
							type="text"
							name="linkedIn"
							id="linkedIn"
							className={montserrat.className}
							defaultValue={user?.social?.linkedIn}
						/>
					</div>
					<div>
						<label htmlFor="youtube">
							<Image
								src="/images/icons/youtube_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>
						</label>
						<input
							type="text"
							name="youtube"
							id="youtube"
							className={montserrat.className}
							defaultValue={user?.social?.youtube}
						/>
					</div>
					<div>
						<label htmlFor="twitch">
							<Image
								src="/images/icons/twitch_icon.svg"
								alt="icon"
								width={30}
								height={30}
							/>
						</label>
						<input
							type="text"
							name="twitch"
							id="twitch"
							className={montserrat.className}
							defaultValue={user?.social?.twitch}
						/>
					</div>
					<button hidden type="submit">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
