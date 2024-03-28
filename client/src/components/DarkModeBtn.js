import { DarkModeContext } from "@/context/darkMode";
import Image from "next/image";
import styles from "@/styles/components/darkModeBtn.module.css";
import { useContext, useState } from "react";
export default function DarkModeBtn() {
	const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
	const [image, setImage] = useState("images/icons/moon_icon.svg");
	function switchMode(e) {
		e.preventDefault();

		const switchBtn = document.getElementById("switch");
		switchBtn.classList.add(styles.anim);
		let timeout;
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			if (!isDarkMode) {
				setImage("images/icons/sun_icon.svg");
			} else {
				setImage("images/icons/moon_icon.svg");
			}
		}, 250);

		switchBtn.addEventListener("animationend", () => {
			if (!isDarkMode) {
				document
					.getElementsByTagName("body")[0]
					.setAttribute("data-dark", true);
				setIsDarkMode(true);
			} else {
				document
					.getElementsByTagName("body")[0]
					.setAttribute("data-dark", false);
				setIsDarkMode(false);
			}
			switchBtn.classList.remove(styles.anim);
		});
	}

	return (
		<div className={styles.container}>
			<div onClick={switchMode} className={styles.btn} id="switch">
				<Image src={`/${image}`} alt="icon" width={20} height={20} />
			</div>
		</div>
	);
}
