import Image from "next/image";
import styles from "../styles/pages/home.module.css";
import { josefinSans } from "@/libs/fonts";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				{/* heading  */}
				<div className={styles.hero}>
					<div className={styles.hero__header}>
						<div className={styles.hero__header__title}>
							<h1>
								Travailler, anticiper, partager.
								<span>
									<span>Arya</span> est l'espace de travail parfait pour
									organiser son travail, échanger.
								</span>
							</h1>
						</div>
						<div className={styles.hero__header__btn}>
							<button className={josefinSans.className}>
								Rejoindre la communauté
							</button>
						</div>
					</div>
					<div className={styles.hero__content}>
						<div className={styles.hero__content__articles}>
							<a href="">
								<article>
									<div>
										<Image
											src="/images/icons/work_icon.svg"
											width={20}
											height={20}
										/>
									</div>
									<div>
										<h2>Trouve un travail</h2>
									</div>
									<div>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Nulla interdum egestas imperdiet.
										</p>
									</div>
									<div>
										<span>En savoir plus</span>
									</div>
								</article>
							</a>
							<a href="">
								<article>
									<div>
										<Image
											src="/images/icons/social_icon.svg"
											width={20}
											height={20}
										/>
									</div>
									<div>
										<h2>Réseau social</h2>
									</div>
									<div>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Nulla interdum egestas imperdiet.
										</p>
									</div>
									<div>
										<span>En savoir plus</span>
									</div>
								</article>
							</a>
							<a href="">
								<article>
									<div>
										<Image
											src="/images/icons/calendar_icon.svg"
											width={20}
											height={20}
										/>
									</div>
									<div>
										<h2>Organise toi</h2>
									</div>
									<div>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Nulla interdum egestas imperdiet.
										</p>
									</div>
									<div>
										<span>En savoir plus</span>
									</div>
								</article>
							</a>
							<a href="">
								<article>
									<div>
										<Image
											src="/images/icons/chart_icon.svg"
											width={20}
											height={20}
										/>
									</div>
									<div>
										<h2>Organise toi</h2>
									</div>
									<div>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Nulla interdum egestas imperdiet.
										</p>
									</div>
									<div>
										<span>En savoir plus</span>
									</div>
								</article>
							</a>
							<a href="">
								<article>
									<div>
										<Image
											src="/images/icons/schedule_icon.svg"
											width={20}
											height={20}
										/>
									</div>
									<div>
										<h2>Organise toi</h2>
									</div>
									<div>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Nulla interdum egestas imperdiet.
										</p>
									</div>
									<div>
										<span>En savoir plus</span>
									</div>
								</article>
							</a>
							<div>
								<ul>
									<li>gratuit</li>
									<li>Prenium</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				{/* content */}
				<div className={styles.main}>
					{/* partie gratuite */}
					<section className={styles.main__section}>
						<h2>
							Vous avez besoin d'un travail ? De vous faire connaître ? Ou
							encore mieux vous organiser ?
						</h2>
						{/* find job */}
						<article>
							<div></div>
							<div></div>
						</article>
						{/* social */}
						<article>
							<div></div>
							<div></div>
						</article>
						{/* agenda */}
						<article>
							<div></div>
							<div></div>
						</article>
					</section>
					{/* partie payante */}
					<section className={styles.main__section}>
						<article></article>
						<article></article>
					</section>
				</div>
				{/* foot */}
				<div></div>
			</div>
		</main>
	);
}
