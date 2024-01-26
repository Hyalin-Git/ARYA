"use client";
import { useEffect, useRef } from "react";
import styles from "../../styles/components/home/service.module.css";
import Image from "next/image";
import Card from "../Card";

export default function Service() {
	const serviceWrapper = useRef(null);

	const servicesElements = [
		{
			id: 1,
			title: "Trouve un travail",
			icon: "./images/icons/work_icon.svg",
			subscriptions: false,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
			anchor: "work",
		},
		{
			id: 2,
			title: "Réseau social",
			icon: "./images/icons/social_icon.svg",
			subscriptions: false,
			description: `Postez et échangez avec la communauté ARYA. Soyez libres de poster ce qui vous plaît, montrez vos talents, libérez votre imaginaire dans cette sphère créative !`,
			anchor: "social",
		},
		{
			id: 3,
			title: "Organise toi",
			icon: "./images/icons/calendar_icon.svg",
			subscriptions: false,
			description:
				"Organisez-vous de manière simple et méthodique, puis suivez vos projets planifiés sur ARYA",
			anchor: "organize",
		},
		{
			id: 4,
			title: "Planifie à l'avance",
			icon: "./images/icons/schedule_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
			anchor: "organize",
		},
		{
			id: 5,
			title: "Tes statistiques",
			icon: "./images/icons/chart_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
			anchor: "organize",
		},
		{
			id: 6,
			title: "Tes statistiques",
			icon: "./images/icons/chart_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
			anchor: "organize",
		},
	];

	const sortedServices = servicesElements.sort(
		(a, b) => a.subscriptions - b.subscriptions
	);

	function handleScroll(e) {
		const scrollContainer = serviceWrapper.current;
		// Récupérer la position actuelle de défilement horizontal
		// Récupérer la largeur totale du contenu déroulable
		// Récupérer la largeur de la fenêtre visible
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

		// Si le défilement est au début ou à la fin, permettre le défilement vertical
		if (
			(scrollLeft === 0 && e.deltaY < 0) ||
			(scrollLeft === scrollWidth - clientWidth && e.deltaY > 0)
		) {
			return;
		}
		// Appliquer le défilement horizontal par défaut tout en arrêtant le scroll vertical avec preventDefault
		scrollContainer.scrollLeft += e.deltaY * 4;
		e.preventDefault();
	}

	useEffect(() => {
		serviceWrapper.current.addEventListener("wheel", handleScroll, {
			passive: false,
		});

		return () =>
			serviceWrapper.current.removeEventListener("wheel", handleScroll);
	}, []);

	return (
		<section>
			<div className={styles.header}>
				<h2>Une solution pour tous,</h2>
				<p>Une multitude de service pour satisfaire tout le monde</p>
			</div>
			<div className={styles.container}>
				<div className={styles.wrapper} ref={serviceWrapper}>
					{sortedServices.map((service) => {
						return <Card key={service.id} elements={service} />;
					})}
				</div>
			</div>
		</section>
	);
}
