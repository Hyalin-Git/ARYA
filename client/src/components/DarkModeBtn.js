import { DarkModeContext } from "@/context/darkMode";
import Image from "next/image";
import styles from "@/styles/components/darkModeBtn.module.css";
import { useContext } from "react";
export default function DarkModeBtn() {
	const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);

	function switchMode(e) {
		e.preventDefault();
		const checkbox = document.getElementById("darkMode");
		if (!checkbox.checked) {
			checkbox.checked = true;
			document.getElementsByTagName("body")[0].setAttribute("data-dark", true);
			setIsDarkMode(true);
		} else {
			checkbox.checked = false;
			document.getElementsByTagName("body")[0].setAttribute("data-dark", false);
			setIsDarkMode(false);
		}
	}

	return (
		<div className={styles.container}>
			<input hidden type="checkbox" name="darkMode" id="darkMode" />
			<div onClick={switchMode} data-dark={isDarkMode} className={styles.btn}>
				{isDarkMode && (
					<Image
						src={"/images/icons/sun_icon.svg"}
						alt="icon"
						width={20}
						height={20}
					/>
				)}
				{!isDarkMode && (
					<Image
						src={"/images/icons/moon_icon.svg"}
						alt="icon"
						width={20}
						height={20}
					/>
				)}
			</div>
		</div>
	);
}
