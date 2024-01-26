import Image from "next/image";
import styles from "../styles/components/card.module.css";

export default function Card({ elements }) {
	return (
		<article
			data-sub={elements.subscriptions}
			data-anchor={elements.anchor}
			className={styles.container}>
			<div className={styles.images}>
				<div className={styles.logo}>
					<Image src={elements.icon} width={60} height={60} alt="logo" />
				</div>
				{elements.subscriptions && (
					<div className={styles.crown}>
						<Image
							src="/images/icons/crown_icon.svg"
							width={35}
							height={35}
							alt="crown"
						/>
					</div>
				)}
			</div>
			<div className={styles.body}>
				<div className={styles.title}>
					<h3>{elements.title}</h3>
				</div>
				<div className={styles.content}>
					<p>{elements.description}</p>
				</div>
			</div>
		</article>
	);
}
