"use client";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "@/styles/pages/portal.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Portal() {
	const router = useRouter();
	const arya = useRef(null);
	const aryaMedia = useRef(null);
	const background = useRef(null);
	const { uid, setUid, user } = useContext(AuthContext);

	function drag(e) {
		e.preventDefault();
		let isDown = true;
		const element = e.currentTarget;
		const arrows = document.getElementsByClassName(styles.arrow);
		const rect = element.getBoundingClientRect();

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
			arya.current.style.scale = "1";
			aryaMedia.current.style.scale = "1";
			background.current.style.backgroundPosition = "50% 50%";
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

				handleAnimations(position, arrows);
			}
		});
	}

	function handleAnimations(position, arrows) {
		console.log(position);

		console.log(arrows);

		// Left arrows
		arrows[0].classList.toggle(styles.active, position <= -100);
		arrows[1].classList.toggle(styles.active, position <= -200);
		arrows[2].classList.toggle(styles.active, position <= -350);
		arrows[3].classList.toggle(styles.active, position <= -480);
		// Right arrows
		arrows[4].classList.toggle(styles.active, position >= 100);
		arrows[5].classList.toggle(styles.active, position >= 200);
		arrows[6].classList.toggle(styles.active, position >= 350);
		arrows[7].classList.toggle(styles.active, position >= 480);
		if (position >= 0) {
			if (position >= 100 && position < 200) {
				arya.current.style.scale = "1.05";
				aryaMedia.current.style.scale = "0.95";
				background.current.style.backgroundPosition = "70% 50%";
			} else if (position >= 200 && position < 300) {
				arya.current.style.scale = "1.1";
				aryaMedia.current.style.scale = "0.90";
				background.current.style.backgroundPosition = "80% 50%";
			} else if (position >= 300 && position < 400) {
				arya.current.style.scale = "1.15";
				aryaMedia.current.style.scale = "0.85";
				background.current.style.backgroundPosition = "90% 50%";
			} else if (position >= 400) {
				arya.current.style.scale = "1.2";
				aryaMedia.current.style.scale = "0.80";
				background.current.style.backgroundPosition = "100% 50%";
			} else {
				arya.current.style.scale = "1";
				aryaMedia.current.style.scale = "1";
				background.current.style.backgroundPosition = "50% 50%";
			}
		} else {
			if (position <= -100 && position > -200) {
				aryaMedia.current.style.scale = "1.05";
				arya.current.style.scale = "0.95";
				background.current.style.backgroundPosition = "30% 50%";
			} else if (position <= -200 && position > -300) {
				aryaMedia.current.style.scale = "1.1";
				arya.current.style.scale = "0.90";
				background.current.style.backgroundPosition = "20% 50%";
			} else if (position <= -300 && position > -400) {
				aryaMedia.current.style.scale = "1.15";
				arya.current.style.scale = "0.85";
				background.current.style.backgroundPosition = "10% 50%";
			} else if (position <= -400) {
				aryaMedia.current.style.scale = "1.2";
				arya.current.style.scale = "0.80";
				background.current.style.backgroundPosition = "0% 50%";
			}
		}
	}

	return (
		<div className={styles.container} id="background" ref={background}>
			<div className={styles.header}>
				<div>
					<div>
						<h2 id="aryaMedia" ref={aryaMedia}>
							Arya Media
						</h2>
					</div>
				</div>
				<div>
					<div>
						<h2 id="arya" ref={arya}>
							Arya
						</h2>
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
