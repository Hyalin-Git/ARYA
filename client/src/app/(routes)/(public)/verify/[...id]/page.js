"use server";
import styles from "@/styles/pages/verify.module.css";
import Image from "next/image";
import Link from "next/link";
import { verifyEmail } from "@/api/verifications/verifications";
import { montserrat } from "@/libs/fonts";
import { cookies } from "next/headers";

export default async function Verify({ params }) {
	await verifyEmail(params.id[0], params.id[1]);
	const log = cookies().get("session");

	return (
		<main>
			<div className={styles.container}>
				<div className={styles.background}>
					<div>
						<h2>Adresse mail vérifiée avec succès</h2>
						<br />
						<Image
							src="/images/icons/success_icon.svg"
							width={80}
							height={80}
							alt="icone de succès"
						/>
					</div>
					<div>
						<p>
							Votre adresse mail a été vérifiée avec succès, vous pouvez
							maintenant profiter de toutes les fonctionnalités de{" "}
							<span>Arya</span>
						</p>
					</div>
					<div>
						{/* Not login home else portal  */}
						<Link href={log ? "/portal" : "/"}>
							<button className={montserrat.className}>
								Profiter pleinement de <span>Arya</span>
							</button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
