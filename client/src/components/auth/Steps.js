"use client";
import styles from "@/styles/components/auth/steps.module.css";
import { useState } from "react";
import UserStep from "./UserStep";
import AccountType from "./AccountTypeStep";
import CompanyStep from "./CompanyStep";
import WorkerStep from "./WorkerStep";

export default function Steps({ step, setStep }) {
	const [isCompany, setIsCompany] = useState(false);
	const [isWorker, setIsWorker] = useState(false);

	return (
		<>
			<div className={styles.steps} data-step="1" id="step-1">
				<UserStep setStep={setStep} />
			</div>

			<div className={styles.steps} data-step="2" id="step-2">
				<AccountType
					setIsCompany={setIsCompany}
					setIsWorker={setIsWorker}
					setStep={setStep}
				/>
			</div>

			<div className={styles.steps} data-step="3" id="step-3">
				{isCompany && (
					<>
						<CompanyStep />
					</>
				)}
				{isWorker && (
					<>
						<WorkerStep />
					</>
				)}
			</div>
		</>
	);
}
