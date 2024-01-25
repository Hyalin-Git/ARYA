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
			description: `Postez et échangez avec la communauté <span>ARYA</span>. Soyez libres de poster ce qui vous plaît, montrez vos talents, libérez votre imaginaire dans cette sphère créative !`,
		},
		{
			id: 3,
			title: "Organise toi",
			icon: "./images/icons/calendar_icon.svg",
			subscriptions: false,
			description:
				"Organisez-vous de manière simple et méthodique, puis suivez vos projets planifiés sur ARYA",
		},
		{
			id: 4,
			title: "Planifie à l'avance",
			icon: "./images/icons/schedule_icon.svg",
			subscriptions: true,
			description:
				"Un espace simple et abordable dans lequel vous pourrez décrocher l’emploi de vos rêves ou trouver votre candidat idéal en un clic.",
		},
		{
			id: 5,
			title: "Tes statistiques",
			icon: "./images/icons/chart_icon.svg",
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
		target.scrollLeft += e.deltaY * 4; // Allow horizontal scroll
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
						<div className={styles.article__images}>
							<div className={styles.article__logo}>
								<Image src={service.icon} width={60} height={60} />
							</div>
							{service.subscriptions && (
								<div className={styles.article__crown}>
									<Image
										src="/images/icons/crown_icon.svg"
										width={35}
										height={35}
									/>
								</div>
							)}
						</div>
						<div className={styles.article__body}>
							<div className={styles.article__title}>
								<h3>{service.title}</h3>
							</div>
							<div className={styles.article__content}>
								<p>{service.description}</p>
							</div>
						</div>
						{/* <div className={styles.article__more}>
							<span>En savoir plus</span>
						</div> */}
					</article>
				);
			})}
		</div>
	);
}
