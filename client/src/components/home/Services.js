"use client";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import styles from "../../styles/components/home/service.module.css";
import Image from "next/image";

export default function Service() {
	const serviceWrapper = useRef("");
	const servicesElements = [
		{
			id: 1,
			title: "Trouve un travail",
			icon: "./images/icons/work_icon.svg",
			subscriptions: false,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 2,
			title: "Réseau social",
			icon: "./images/icons/social_icon.svg",
			subscriptions: false,
			description:
				"Postez et échangez avec la communauté Arya. Soyez libres de poster ce qui vous plaît, montrez vos talents, libérez votre imaginaire dans cette sphère créative !",
		},
		{
			id: 3,
			title: "Organuse toi",
			icon: "./images/icons/work_icon.svg",
			subscriptions: false,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 4,
			title: "Planifie à l'avance",
			icon: "./images/icons/work_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 5,
			title: "Tes statistiques",
			icon: "./images/icons/work_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 6,
			title: "Tes statistiques",
			icon: "./images/icons/work_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 7,
			title: "Tes statistiques",
			icon: "./images/icons/work_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
	];

	const sortedServices = servicesElements.sort(
		(a, b) => a.subscriptions - b.subscriptions
	);

	const transformScroll = useDebouncedCallback((e, target) => {
		console.log(e);
		e.preventDefault(); // Empêche le défilement vertical
		target.scrollLeft += e.deltaY * 4;
	}, 200);

	return (
		<div
			className={styles.services__wrapper}
			ref={serviceWrapper}
			onWheel={(e) => {
				console.log(e.currentTarget);
				transformScroll(e, serviceWrapper.current);
			}}>
			{sortedServices.map((service) => {
				return (
					<article key={service.id}>
						<div>
							<Image src={service.icon} width={25} height={25} />
						</div>
						<div>
							<h3>{service.title}</h3>
						</div>
						<div>
							<p>{service.description}</p>
						</div>
						<div>
							<span>En savoir plus</span>
						</div>
					</article>
				);
			})}
		</div>
	);
}
