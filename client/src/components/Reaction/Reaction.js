import styles from "@/styles/components/reaction/reaction.module.css";
import Image from "next/image";

export default function Reaction({
	userHasReacted,
	getUserReaction,
	handleReaction,
	reactionModal,
	handleMouseClick,
	handleDeleteReaction,
	handleMouseLeave,
}) {
	return (
		<div
			className={styles.container}
			onClick={!userHasReacted ? handleMouseClick : null}>
			{reactionModal && (
				<div className={styles.reactionModal} onMouseLeave={handleMouseLeave}>
					<Image
						src={"/images/icons/love_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => {
							handleReaction(e, "love");
						}}
					/>
					<Image
						src={"/images/icons/funny_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => {
							handleReaction(e, "funny");
						}}
					/>
					<Image
						src={"/images/icons/surprised_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => {
							handleReaction(e, "surprised");
						}}
					/>
					<Image
						src={"/images/icons/sad_icon.svg"}
						alt="icon"
						width={25}
						height={25}
						onClick={(e) => {
							handleReaction(e, "sad");
						}}
					/>
				</div>
			)}
			{userHasReacted ? (
				<Image
					src={`/images/icons/${getUserReaction}_icon.svg`}
					alt="icon"
					width={25}
					height={25}
					onClick={handleDeleteReaction}
				/>
			) : (
				<Image
					src={"/images/icons/addReaction_icon.svg"}
					alt="icon"
					width={25}
					height={25}
					id="icon"
				/>
			)}
		</div>
	);
}
