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
		{
			id: 7,
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

	const horizontalScroll = useDebouncedCallback((e) => {
		console.log(e);
		e.currentTarget.scrollLeft += e.deltaY * 4;
		console.log(e);
	}, 100);

	// function horizontalScroll(e) {
	// 	e.preventDefault();
	// 	e.currentTarget.scrollLeft += e.deltaY * 4;
	// }

	function scrollToAnchor(e) {
		const anchor = e.currentTarget.getAttribute("data-anchor");
		document.getElementById(anchor).scrollIntoView({ behavior: "smooth" });
	}

	useEffect(() => {
		serviceWrapper.current.addEventListener(
			"wheel",
			(e) => {
				e.preventDefault();
				horizontalScroll(e);
			},
			{
				passive: false,
			}
		);

		return () =>
			serviceWrapper.current.removeEventListener("wheel", horizontalScroll);
	}, []);

	return (
		<div className={styles.services__wrapper} ref={serviceWrapper}>
			{sortedServices.map((service) => {
				return (
					<article
						data-sub={service.subscriptions}
						data-anchor={service.anchor}
						key={service.id}
						onClick={scrollToAnchor}>
						<div className={styles.article__images}>
							<div className={styles.article__logo}>
								<Image src={service.icon} width={60} height={60} alt="logo" />
							</div>
							{service.subscriptions && (
								<div className={styles.article__crown}>
									<Image
										src="/images/icons/crown_icon.svg"
										width={35}
										height={35}
										alt="crown"
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
