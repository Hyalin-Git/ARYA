import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import Image from "next/image";
export default async function UsInfo() {
	const { user } = useContext(AuthContext);

	return (
		<li>
			<Image
				src={user.picture ? user.picture : "/images/profil/default-pfp.jpg"}
				alt="profil"
				width={30}
				height={30}
			/>
			<div>
				{user.firstName} {user.lastName}
				<br />
				<span>{user.userName}</span>
			</div>
			<Image
				src="./images/icons/ellipsis_icon.svg"
				alt="icon"
				width={20}
				height={20}
			/>
		</li>
	);
}
