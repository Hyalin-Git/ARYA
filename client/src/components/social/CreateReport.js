"use client";
import { saveReportPost } from "@/actions/report";
import { AuthContext } from "@/context/auth";
import { montserrat } from "@/libs/fonts";
import styles from "@/styles/components/social/createReport.module.css";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";

import PopUp from "../popup/PopUp";

export default function CreateReport({
	element,
	elementId,
	setReportModal,
	formAction,
}) {
	const { uid } = useContext(AuthContext);

	// const type = element === "post" ? "post" : "user";
	const [message, setMessage] = useState(false);
	const reasons = [
		{
			id: 1,
			title: "Discours haineux ou discriminatoire",
			description:
				"Le discours haineux ou discriminatoire fait référence à tout contenu en ligne qui attaque ou dénigre un individu ou un groupe en raison de caractéristiques telles que leur race, leur religion ou leur orientation sexuelle",
		},
		{
			id: 2,
			title: "Contenu inapproprié",
			description:
				"Le contenu inapproprié fait référence à tout matériel en ligne qui est offensant, obscène, ou qui viole nos directives communautaires. Cela peut inclure des images ou des textes à caractère sexuel, de la violence gratuite, ou toute autre forme de contenu inadapté",
		},
		{
			id: 3,
			title: "Comportement de harcèlement",
			description:
				"Le harcèlement en ligne se produit lorsqu'un individu cible délibérément une autre personne avec des messages offensants, menaçants ou nuisibles. Cela peut inclure des insultes, des attaques personnelles répétées, ou toute forme de comportement visant à intimider ou à causer de la détresse émotionnelle",
		},
		{
			id: 4,
			title: "Faux compte ou usurpation d'identité",
			description:
				"Les faux comptes ou l'usurpation d'identité surviennent lorsqu'une personne crée un profil en utilisant des informations trompeuses ou en se faisant passer pour quelqu'un d'autre. Cela peut inclure l'utilisation de photos ou de noms falsifiés dans le but de tromper les autres utilisateurs",
		},
		{
			id: 5,
			title: "Incitation à la violence ou aux activités illégales",
			description:
				"L'incitation à la violence ou aux activités illégales se produit lorsque du contenu en ligne encourage ou promeut des actions criminelles ou des comportements violents. Cela peut inclure des appels à commettre des actes de violence physique, des menaces de dommages corporels, ou toute autre activité contraire à la loi",
		},
		{
			id: 6,
			title: "Autre",
			description:
				"L'option 'Autre' est destinée à signaler tout contenu ou comportement qui ne correspond pas aux catégories précédemment mentionnées. Si vous rencontrez quelque chose qui vous semble inapproprié, nuisible ou contraire à nos directives communautaires, n'hésitez pas à le signaler en utilisant cette option, vous pourrez aussi ajouter un message",
		},
	];

	// useEffect(() => {
	// 	if (state.status === "success") {
	// 		// setReportModal(false);
	// 	}
	// }, [state]);
	function handleChoice(e) {
		e.preventDefault();
		const target = e.currentTarget;
		const reasons = document.getElementsByClassName(styles.reason);
		for (const reason of reasons) {
			reason.classList.remove(styles.checked);
		}
		const input = target.lastChild;
		input.checked = true;
		target.classList.add(styles.checked);

		if (input.id === "Autre") {
			setMessage(true);
		} else {
			setMessage(false);
		}

		// console.log(input.id);
	}
	return (
		<>
			<div id="modal">
				<div className={styles.header}>
					<span>
						Quel genre de problème rencontrez-vous avec cette publication ?
					</span>
				</div>

				<div className={styles.content}>
					<form action={formAction}>
						{reasons.map((reason) => {
							return (
								<div
									className={styles.reason}
									key={reason.id}
									onClick={handleChoice}>
									<div>
										<span>{reason.title}</span>
									</div>
									<div>
										<p>{reason.description}</p>
									</div>
									<input
										type="radio"
										name="reason"
										id={reason.title}
										value={reason.title}
										hidden
									/>
								</div>
							);
						})}
						{message && (
							<div className={styles.message}>
								<textarea
									name="message"
									id="message"
									cols="30"
									rows="10"
									placeholder="Partager plus de détails"></textarea>
							</div>
						)}
						<input
							type="text"
							id="elementId"
							name="elementId"
							value={elementId}
							hidden
						/>
						<div className={clsx(styles.button, montserrat.className)}>
							<button type="submit">Envoyer</button>
						</div>
					</form>
				</div>
			</div>

			<div id="overlay" onClick={(e) => setReportModal(false)}></div>
		</>
	);
}
