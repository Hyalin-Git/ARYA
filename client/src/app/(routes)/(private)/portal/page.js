"use client";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/pages/portal.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Portal() {
	const router = useRouter();
	const { uid, setUid, user } = useContext(AuthContext);

	function drag(e) {
		e.preventDefault();
		let isDown = true;
		const element = e.currentTarget;
		const rect = element.getBoundingClientRect();

		console.log(element);

		document.addEventListener("mouseup", function (e) {
			isDown = false;

			router.push("/arya-media");

			element.style.transform = `translateX(0px)`;
		});

		document.addEventListener("mousemove", function (e) {
			if (isDown) {
				console.log(e.clientX);
				const newXpos = Math.max(
					-430,
					Math.min(
						565,
						e.clientX - rect.left // New X position based on mouse X, preventing overflow
					)
				);

				element.style.transform = `translateX(${Math.round(
					newXpos - rect.width / 2
				)}px)`;
			}
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
