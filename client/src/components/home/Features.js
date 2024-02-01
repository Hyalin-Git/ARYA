"use client";
import Markdown from "markdown-to-jsx";
import styles from "../../styles/components/home/features.module.css";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Features() {
	const featureWrapper = useRef("");
	const options = {
		root: null, // L'élément racine utilisé comme viewport. Si null, le viewport du navigateur est utilisé.
		rootMargin: "0px", // Marge autour du viewport pour étendre ou réduire la zone d'intersection.
		threshold: 0.4, // Valeur de seuil pour déterminer quand l'élément est considéré comme intersecté (0.5 signifie que la moitié de l'élément doit être visible).
	};

	const featuresElements = [
		{
			id: 1,
			title: "Un travail à porté de main",
			image: "",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae mauris libero. Mauris non nisi eleifend, iaculis diam vitae, lobortis lorem. Duis et ex lacus. Suspendisse potenti. Suspendisse nulla lacus, aliquam in fringilla faucibus, interdum ut metus. Nunc vehicula metus ac est commodo suscipit. Donec fringilla sollicitudin nunc, eget dapibus dui rhoncus in. Nullam ac velit id orci viverra consectetur. Morbi nec nisl tortor. Etiam nec suscipit dolor. Nullam felis massa, vehicula a scelerisque sed, cursus in erat.",
			anchor: "work",
		},
		{
			id: 2,
			title: "Un travail à porté de main",
			image: "",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae mauris libero. Mauris non nisi eleifend, iaculis diam vitae, lobortis lorem. Duis et ex lacus. Suspendisse potenti. Suspendisse nulla lacus, aliquam in fringilla faucibus, interdum ut metus. Nunc vehicula metus ac est commodo suscipit. Donec fringilla sollicitudin nunc, eget dapibus dui rhoncus in. Nullam ac velit id orci viverra consectetur. Morbi nec nisl tortor. Etiam nec suscipit dolor. Nullam felis massa, vehicula a scelerisque sed, cursus in erat.",
			anchor: "social",
		},
		{
			id: 3,
			title: "Un travail à porté de main",
			image: "",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae mauris libero. Mauris non nisi eleifend, iaculis diam vitae, lobortis lorem. Duis et ex lacus. Suspendisse potenti. Suspendisse nulla lacus, aliquam in fringilla faucibus, interdum ut metus. Nunc vehicula metus ac est commodo suscipit. Donec fringilla sollicitudin nunc, eget dapibus dui rhoncus in. Nullam ac velit id orci viverra consectetur. Morbi nec nisl tortor. Etiam nec suscipit dolor. Nullam felis massa, vehicula a scelerisque sed, cursus in erat.",
			anchor: "organize",
		},
		{
			id: 4,
			title: "Un travail à porté de main",
			image: "",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae mauris libero. Mauris non nisi eleifend, iaculis diam vitae, lobortis lorem. Duis et ex lacus. Suspendisse potenti. Suspendisse nulla lacus, aliquam in fringilla faucibus, interdum ut metus. Nunc vehicula metus ac est commodo suscipit. Donec fringilla sollicitudin nunc, eget dapibus dui rhoncus in. Nullam ac velit id orci viverra consectetur. Morbi nec nisl tortor. Etiam nec suscipit dolor. Nullam felis massa, vehicula a scelerisque sed, cursus in erat.",
			anchor: "plan",
		},
		{
			id: 5,
			title: "Un travail à porté de main",
			image: "",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae mauris libero. Mauris non nisi eleifend, iaculis diam vitae, lobortis lorem. Duis et ex lacus. Suspendisse potenti. Suspendisse nulla lacus, aliquam in fringilla faucibus, interdum ut metus. Nunc vehicula metus ac est commodo suscipit. Donec fringilla sollicitudin nunc, eget dapibus dui rhoncus in. Nullam ac velit id orci viverra consectetur. Morbi nec nisl tortor. Etiam nec suscipit dolor. Nullam felis massa, vehicula a scelerisque sed, cursus in erat.",
			anchor: "stat",
		},
	];

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				entry.target.classList.toggle(styles.inView, entry.isIntersecting);
			});
		}, options);

		const items = document.getElementsByClassName("feature");
		for (const item of items) {
			observer.observe(item);
		}
	}, []);

	return (
		<div className={styles.container}>
			{featuresElements.map((feature) => {
				return (
					<div
						ref={featureWrapper}
						className={clsx(styles.wrapper, "feature")}
						key={feature.id}
						id={feature.anchor}>
						<div className={styles.left}>
							<div className={styles.img}></div>
						</div>
						<div className={styles.right}>
							<div className={styles.title}>
								<h3>{feature.title}</h3>
							</div>
							<div className={styles.description}>
								<p>{feature.description}</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
