"use client";
import styles from "@/styles/pages/settings.module.css";
import SocialEditor from "@/components/settings/profil/SocialEditor";
import ToolsEditor from "@/components/settings/profil/ToolsEditor";
import UserEditor from "@/components/settings/profil/UserEditor";
import { AuthContext } from "@/context/auth";
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
		<div className={styles.container}>
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
	);
}
