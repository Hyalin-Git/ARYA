import { blockUser, follow, unFollow } from "@/api/user/user";
import styles from "@/styles/components/chat/chatHeader.module.css";
import {
	faArrowLeft,
	faBan,
	faCircle,
	faCross,
	faGear,
	faGears,
	faUserAltSlash,
	faUserMinus,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function ChatHeader({
	uid,
	user,
	conversation,
	otherUserId,
	setOpenedConv,
	setOtherUserId,
	setSettings,
}) {
	const isFollowing = user?.following?.includes(otherUserId);
	const [hasFollow, setHasFollow] = useState(isFollowing || false);
	const getOtherUserInfo = conversation?.users?.find(
		(user) => user._id === otherUserId
	);

	function goBack(e) {
		e.preventDefault();
		setOpenedConv(null);
		setOtherUserId(null);
	}

	async function followUser(e) {
		e.preventDefault();
		await follow(uid, otherUserId);

		setHasFollow(true);
	}

	async function unfollowUser(e) {
		e.preventDefault();
		await unFollow(uid, otherUserId);

		setHasFollow(false);
	}

	console.log(isFollowing, "follow");

	return (
		<div className={styles.container}>
			<FontAwesomeIcon
				icon={faArrowLeft}
				onClick={goBack}
				className={styles.back}
			/>
			<Image
				src={getOtherUserInfo?.picture || "/images/profil/default-pfp.jpg"}
				alt="picture"
				width={40}
				height={40}
				quality={100}
			/>
			<FontAwesomeIcon
				data-connected={getOtherUserInfo?.status?.isConnected}
				className={styles.connectivity}
				icon={faCircle}
			/>
			<div className={styles.names}>
				<span>
					{getOtherUserInfo?.firstName + " " + getOtherUserInfo?.lastName}
				</span>
				<span>{getOtherUserInfo?.userName}</span>
			</div>
			<div className={styles.icons}>
				{!hasFollow ? (
					<FontAwesomeIcon
						icon={faUserPlus}
						title="Suivre cet utilisateur"
						onClick={followUser}
					/>
				) : (
					<FontAwesomeIcon
						icon={faUserMinus}
						title="Suivre cet utilisateur"
						onClick={unfollowUser}
					/>
				)}
				<FontAwesomeIcon
					icon={faGear}
					title="Paramètres de la conversation"
					onClick={(e) => setSettings(true)}
				/>
			</div>
		</div>
	);
}
