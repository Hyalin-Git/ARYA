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
			const value = element.style.transform.split("(")[1].split("p")[0];
			console.log(value);
			if (Number(value) <= -430) {
				router.push("/AryaMedia");
			}
			if (Number(value) >= 490) {
				router.push("/Arya");
			}

			element.style.transform = `translateX(0px)`;
			document.getElementById("aryaMedia").style.scale = "1";
			document.getElementById("arya").style.scale = "1";
			document.getElementById("background").style.backgroundPosition =
				"50% 50%";
		});

		document.addEventListener("mousemove", function (e) {
			if (isDown) {
				const newXpos = Math.max(
					-430,
					Math.min(
						565,
						e.clientX - rect.left // New X position based on mouse X, preventing overflow
					)
				);

				const position = newXpos - rect.width / 2;

				element.style.transform = `translateX(${Math.round(position)}px)`;

				console.log(position);
				console.log(position >= 100);
				if (position >= 0) {
					if (position >= 100 && position < 200) {
						document.getElementById("arya").style.scale = "1.05";
						document.getElementById("aryaMedia").style.scale = "0.95";
						document.getElementById("background").style.backgroundPosition =
							"70% 50%";
					} else if (position >= 200 && position < 300) {
						document.getElementById("arya").style.scale = "1.1";
						document.getElementById("aryaMedia").style.scale = "0.90";
						document.getElementById("background").style.backgroundPosition =
							"80% 50%";
					} else if (position >= 300 && position < 400) {
						document.getElementById("arya").style.scale = "1.15";
						document.getElementById("aryaMedia").style.scale = "0.85";
						document.getElementById("background").style.backgroundPosition =
							"90% 50%";
					} else if (position >= 400) {
						document.getElementById("arya").style.scale = "1.2";
						document.getElementById("aryaMedia").style.scale = "0.80";
						document.getElementById("background").style.backgroundPosition =
							"100% 50%";
					} else {
						document.getElementById("aryaMedia").style.scale = "1";
						document.getElementById("arya").style.scale = "1";
						document.getElementById("background").style.backgroundPosition =
							"50% 50%";
					}
				} else {
					if (position <= -100 && position > -200) {
						document.getElementById("aryaMedia").style.scale = "1.05";
						document.getElementById("arya").style.scale = "0.95";
						document.getElementById("background").style.backgroundPosition =
							"30% 50%";
					} else if (position <= -200 && position > -300) {
						document.getElementById("aryaMedia").style.scale = "1.1";
						document.getElementById("arya").style.scale = "0.90";
						document.getElementById("background").style.backgroundPosition =
							"20% 50%";
					} else if (position <= -300 && position > -400) {
						document.getElementById("aryaMedia").style.scale = "1.15";
						document.getElementById("arya").style.scale = "0.85";
						document.getElementById("background").style.backgroundPosition =
							"10% 50%";
					} else if (position <= -400) {
						document.getElementById("aryaMedia").style.scale = "1.2";
						document.getElementById("arya").style.scale = "0.80";
						document.getElementById("background").style.backgroundPosition =
							"0% 50%";
					}
				}
			}
		});
	}

	return (
		<div className={styles.container} id="background">
			<div className={styles.header}>
				<div>
					<div>
						<h2 id="aryaMedia">Arya Media</h2>
					</div>
				</div>
				<div>
					<div>
						<h2 id="arya">Arya</h2>
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
