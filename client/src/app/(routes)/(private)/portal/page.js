"use client";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/pages/portal.module.css";
import clsx from "clsx";

export default function Portal() {
	const { uid, setUid, user } = useContext(AuthContext);

	function drag(e) {
		e.preventDefault();
		const element = e.currentTarget;
		const rect = element.getBoundingClientRect();
		console.log(element);

		document.addEventListener("mousemove", function (e) {
			const newXpos = Math.max(
				Math.min(
					e.clientX - rect.left, // New X position based on mouse X, preventing overflow
					window.innerWidth - rect.width // Maximum X position (prevent going beyond the right edge)
				)
			);

			element.style.transform = `translateX(${newXpos}px)`;
			console.log(newXpos);
		});
	}

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div>
					<div>
						<h2>Arya Media</h2>
					</div>
				</div>
				<div>
					<div>
						<h2>Arya</h2>
					</div>
				</div>
			</div>
			<div className={styles.bottom}>
				<div>
					<h3 className={clsx(user.firstName ? styles.visible : styles.hidden)}>
						Hello ! {user.firstName}, de quel côté êtes-vous ?
					</h3>
				</div>
				<div className={styles.bottomWrapper} id="bottom-wrapper">
					<div className={styles.limiter}></div>
					<div className={styles.arrows}>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
					</div>
					<div className={styles.move} onMouseDown={drag}>
						<span>Déplace moi</span>
					</div>
					<div className={styles.arrows}>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
						<div className={styles.arrow}>
							<div></div>
							<div></div>
						</div>
					</div>
					<div className={styles.limiter}></div>
				</div>
			</div>
		</div>
	);
}
