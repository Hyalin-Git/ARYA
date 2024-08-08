import styles from "@/styles/components/chat/chatSettings.module.css";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
	faArrowLeft,
	faArrowLeftLong,
	faBan,
	faImage,
	faTrash,
	faUsers,
	faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function ChatSettings({
	conversation,
	otherUserId,
	setSettings,
}) {
	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	function goBack(e) {
		e.preventDefault();
		setSettings(false);
	}
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<FontAwesomeIcon icon={faArrowLeft} onClick={goBack} />
			</div>
			<div className={styles.conversation}>
				<div>
					<Image
						src={getOtherUserInfo?.picture || "/images/profil/default-pfp.jpg"}
						alt="picture"
						width={80}
						height={80}
						quality={100}
					/>
				</div>
				<div className={styles.name}>
					<span>
						{getOtherUserInfo?.firstName + " " + getOtherUserInfo?.lastName}
					</span>
					<span>{getOtherUserInfo?.userName}</span>
				</div>
			</div>
			<div className={styles.actions}>
				<ul>
					<li>
						<FontAwesomeIcon icon={faWandMagicSparkles} /> Renommer la
						conversation
					</li>
					<li>
						<FontAwesomeIcon icon={faUsers} /> Créer un groupe avec{" "}
						{getOtherUserInfo?.firstName}
					</li>
					<li>
						<FontAwesomeIcon icon={faImage} /> Voir les fichiers partagé
					</li>
					<li>
						<FontAwesomeIcon icon={faBan} /> Bloquer{" "}
						{getOtherUserInfo?.firstName}
					</li>
					<li>
						<FontAwesomeIcon icon={faTrashCan} /> Supprimer la conversation
					</li>
				</ul>
			</div>
		</div>
	);
}
