"use client";
import { updateUserSocial } from "@/actions/user";
import PopUp from "@/components/popup/PopUp";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/socialEditor.module.css";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useDebouncedCallback } from "use-debounce";

const initialState = {
	status: "pending",
	message: "",
	error: [],
};
export default function SocialEditor() {
	const { user, uid } = useContext(AuthContext);
	const [displayPopUp, setDisplayPopUp] = useState(false);
	const updateUserSocialWithUid = updateUserSocial.bind(null, uid);
	const [state, formAction] = useFormState(
		updateUserSocialWithUid,
		initialState
	);

	const errorX = state?.error?.includes("x");
	const errorTiktok = state?.error?.includes("tiktok");
	const errorInstagram = state?.error?.includes("instagram");
	const errorFacebook = state?.error?.includes("facebook");
	const errorLinkedIn = state?.error?.includes("linkedIn");
	const errorYoutube = state?.error?.includes("youtube");
	const errorTwitch = state?.error?.includes("twitch");
	console.log(state);

	const debounced = useDebouncedCallback((e) => {
		e.preventDefault();
		document.getElementById("social-info").requestSubmit();
	}, 1200);

	useEffect(() => {
		if (state?.status === "success" || state?.status === "failure") {
			setDisplayPopUp(true);
			const timeout = setTimeout(() => {
				setDisplayPopUp(false);
			}, 4000);
			if (displayPopUp) {
				clearTimeout(timeout);
			}
		}
	}, [state]);

	return (
		<div className={styles.container} id="social">
			<div className={styles.title}>
				<span>Réseau social</span>
			</div>
			<form action={formAction} id="social-info">
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
							data-error={errorX}
							type="text"
							name="twitter"
							id="twitter"
							className={montserrat.className}
							defaultValue={user?.social?.twitter}
							onChange={debounced}
						/>
					</div>
					{errorX && <i data-error={errorX}>{state?.message}</i>}
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
							data-error={errorTiktok}
							type="text"
							name="tiktok"
							id="tiktok"
							className={montserrat.className}
							defaultValue={user?.social?.tiktok}
							onChange={debounced}
						/>
					</div>
					{errorTiktok && <i data-error={errorTiktok}>{state?.message}</i>}
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
							data-error={errorInstagram}
							type="text"
							name="instagram"
							id="instagram"
							className={montserrat.className}
							defaultValue={user?.social?.instagram}
							onChange={debounced}
						/>
					</div>
					{errorInstagram && (
						<i data-error={errorInstagram}>{state?.message}</i>
					)}
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
							data-error={errorFacebook}
							type="text"
							name="facebook"
							id="facebook"
							className={montserrat.className}
							defaultValue={user?.social?.facebook}
							onChange={debounced}
						/>
					</div>
					{errorFacebook && <i data-error={errorFacebook}>{state?.message}</i>}
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
							data-error={errorLinkedIn}
							type="text"
							name="linkedIn"
							id="linkedIn"
							className={montserrat.className}
							defaultValue={user?.social?.linkedIn}
							onChange={debounced}
						/>
					</div>
					{errorLinkedIn && <i data-error={errorLinkedIn}>{state?.message}</i>}
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
							data-error={errorYoutube}
							type="text"
							name="youtube"
							id="youtube"
							className={montserrat.className}
							defaultValue={user?.social?.youtube}
							onChange={debounced}
						/>
					</div>
					{errorYoutube && <i data-error={errorYoutube}>{state?.message}</i>}
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
							data-error={errorTwitch}
							type="text"
							name="twitch"
							id="twitch"
							className={montserrat.className}
							defaultValue={user?.social?.twitch}
							onChange={debounced}
						/>
					</div>
					{errorTwitch && <i data-error={errorTwitch}>{state?.message}</i>}
					<button hidden type="submit">
						Submit
					</button>
				</div>
			</form>
			{displayPopUp && (
				<PopUp
					status={state?.status}
					title={"Modification"}
					message={state?.message}
				/>
			)}
		</div>
	);
}
