import Markdown from "markdown-to-jsx";
import styles from "../../styles/components/home/features.module.css";

export default function Features() {
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
	];

	return (
		<div className={styles.container}>
			{featuresElements.map((feature) => {
				return (
					<div className={styles.wrapper} id={feature.anchor} key={feature.id}>
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
