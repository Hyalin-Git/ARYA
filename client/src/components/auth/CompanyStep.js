import styles from "@/styles/components/auth/companyStep.module.css";
import StepTracker from "./StepTracker";
import Buttons from "./Buttons";

export default function CompanyStep() {
	return (
		<>
			<div className={styles.titles}>
				<h1>Rejoignez la communauté</h1>
				<h2>
					Veuillez fournir des informations complémentaire pour votre entreprise
				</h2>
			</div>
			<div></div>
		</>
	);
}
