"use client";
import NavPanel from "@/components/settings/NavPanel";
import SocialEditor from "@/components/settings/profil/SocialEditor";
import ToolsEditor from "@/components/settings/profil/ToolsEditor";
import UserEditor from "@/components/settings/profil/UserEditor";
import { AuthContext } from "@/context/auth";
import styles from "@/styles/pages/settings.module.css";
import { useContext } from "react";
import AccountType from "@/components/settings/profil/AccountType";
import Freelance from "@/components/settings/profil/Freelance";
import Company from "@/components/settings/profil/Company";
export default function Settings() {
	const { uid, user } = useContext(AuthContext);
	const isFreelance = user?.freelance;
	const isCompany = user?.company;
	const isLeader = user?.company?.leaderId === uid;

	return (
		<main>
			<div className={styles.container}>
				<aside className={styles.left}>
					<NavPanel />
				</aside>
				<div className={styles.right}>
					<UserEditor />
					<SocialEditor />
					<ToolsEditor />
					{!isFreelance && !isCompany ? (
						<AccountType />
					) : (
						<>
							{isFreelance && <Freelance />}
							{isCompany && isLeader && <Company />}
						</>
					)}
				</div>
			</div>
		</main>
	);
}
