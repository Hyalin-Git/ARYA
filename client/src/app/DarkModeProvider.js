"use client";

import { DarkModeContext } from "@/context/darkMode";
import { useState } from "react";

export default function DarkModeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	return (
		<>
			<DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
				{children}
			</DarkModeContext.Provider>
		</>
	);
}
