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
			title: "Organise toi",
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
	];

	const sortedServices = servicesElements.sort(
		(a, b) => a.subscriptions - b.subscriptions
	);

	const transformScroll = useDebouncedCallback((e, target) => {
		target.scrollLeft += e.deltaY * 2; // Allow horizontal scroll

		const progressBar = document.getElementById("progress-bar");

		target.addEventListener("scroll", (e) => {
			// On scroll make the progress bar progress depending on where is the horizontal scroll bar
			const scrollPercentage =
				(target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100;
			progressBar.style.width = scrollPercentage + "%";
		});
	}, 100);

	function scrollAgain() {
		const htmlElement = document.getElementsByTagName("html")[0];
		htmlElement.style.overflow = "auto";
	}

	function stopScrolling() {
		const htmlElement = document.getElementsByTagName("html")[0];
		htmlElement.style.overflow = "hidden";
	}

	return (
		<div
			className={styles.services__wrapper}
			ref={serviceWrapper}
			onMouseEnter={stopScrolling}
			onWheel={(e) => transformScroll(e, serviceWrapper.current)}
			onMouseLeave={scrollAgain}>
			{sortedServices.map((service) => {
				return (
					<article key={service.id} data-sub={service.subscriptions}>
						<div className={styles.article__img}>
							<Image src={service.icon} width={45} height={45} />
						</div>
						<div className={styles.article__title}>
							<h3>{service.title}</h3>
						</div>
						<div className={styles.article__content}>
							<p>{service.description}</p>
						</div>
						<div className={styles.article__more}>
							<span>En savoir plus</span>
						</div>
					</article>
				);
			})}
		</div>
	);
}
