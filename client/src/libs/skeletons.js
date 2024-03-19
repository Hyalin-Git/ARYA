import styles from "@/styles/layouts/skeletons.module.css";
export function HeaderUser() {
	return (
		<ul className={styles.container}>
			<li>
				<span className={styles.img}></span>
				<div className={styles.info}>
					<div></div>
					<div></div>
				</div>
				<span></span>
			</li>
		</ul>
	);
}
