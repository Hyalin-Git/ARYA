import { updateCompany } from "@/actions/company";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/settings/profil/company.module.css";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { mutate } from "swr";

const initialState = {
	status: "pending",
	message: "",
};
export default function Company() {
	const formRef = useRef(null);
	const { uid, user } = useContext(AuthContext);
	const companyId = user?.company?._id;
	const updateCompanyWithUid = updateCompany.bind(null, uid, companyId);
	const [state, formAction] = useFormState(updateCompanyWithUid, initialState);

	console.log(user?.company);

	useEffect(() => {
		if (state.status === "success") {
			mutate("/login/success");
		}
	}, [state]);

	function handleChange() {
		formRef.current.requestSubmit();
	}

	return (
		<div className={styles.container} id="user">
			<div className={styles.userInfo}>
				<div>
					<span>Entreprise</span>
				</div>
				<form action={formAction} ref={formRef}>
					<div className={styles.form}>
						<div>
							<Image
								src={user?.company?.logo}
								width={100}
								height={100}
								quality={100}
								alt="profil picture"
								style={{
									borderRadius: "50%",
								}}
							/>
							<br />
							<label htmlFor="pict">Changer le logo de l'entreprise</label>
							<input type="file" id="pict" name="pict" hidden />
						</div>
						<div>
							<div className={styles.names}>
								<div>
									<label htmlFor="name">Nom</label>
									<br />
									<input
										type="text"
										name="name"
										id="name"
										className={montserrat.className}
										onChange={handleChange}
										defaultValue={user?.company?.name}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="activity">Secteur d'activité</label>
								<br />
								<input
									type="text"
									name="activity"
									id="activity"
									className={montserrat.className}
									onChange={handleChange}
									defaultValue={user?.company?.activity}
								/>
							</div>
							<div>
								<label htmlFor="biographie">Biographie</label>
								<br />
								<textarea
									type="text"
									name="biographie"
									id="biographie"
									className={montserrat.className}
									onChange={(e) => {
										e.preventDefault();
										e.target.style.height = "";
										e.target.style.height = e.target.scrollHeight + "px";
										handleChange();
									}}
									defaultValue={user?.company?.bio}
								/>
							</div>

							<div className={styles.checkbox}>
								<div>
									<label htmlFor="lookingForEmployees">
										Êtes-vous à la recherche d'employés ?
									</label>
								</div>
								<div>
									<input
										type="checkbox"
										id="lookingForEmployees"
										name="lookingForEmployees"
										onChange={handleChange}
										defaultChecked={user?.company?.lookingForEmployees}
									/>
								</div>
							</div>
							<div>
								<span>Gérer les membres</span>
							</div>
							<button hidden type="submit">
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
