"use client";
import CvEditor from "@/components/settings/profil/CvEditor";
import LookingForJobEditor from "@/components/settings/profil/LookingForJobEditor";
import NavPanel from "@/components/settings/NavPanel";
import SocialEditor from "@/components/settings/profil/SocialEditor";
import ToolsEditor from "@/components/settings/profil/ToolsEditor";
import UserEditor from "@/components/settings/profil/UserEditor";
import { AuthContext } from "@/context/auth";
import styles from "@/styles/pages/settings.module.css";
import { useContext } from "react";
import AccountType from "@/components/settings/profil/AccountType";
export default function Settings() {
	const { user } = useContext(AuthContext);
	const isFreelance = user?.freelance;
	const isCompany = user?.company;
	return (
		<main>
			<div className={styles.container}>
				<aside className={styles.left}>
					<NavPanel />
				</aside>
				<div className={styles.right}>
					<UserEditor />
					<SocialEditor />
					{!isFreelance && !isCompany ? (
						<AccountType />
					) : (
						<>
							<LookingForJobEditor />
							<ToolsEditor />
							{isFreelance && <CvEditor />}
						</>
					)}

					{/* <LookingForJobEditor />
					<SocialEditor />
					<ToolsEditor />
					<CvEditor /> */}
				</div>
			</div>
		</main>
	);
}
