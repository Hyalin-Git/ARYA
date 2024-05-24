import Image from "next/image";
import Link from "next/link";
export default function HeaderUserInfo({ user }) {
	return (
		<li>
			<Link href={`/user/${user.userName}/posts`}>
				<Image
					src={user.picture ? user.picture : "/images/profil/default-pfp.jpg"}
					alt="profil"
					width={30}
					height={30}
					id="user-picture"
				/>
				<div>
					<span>
						{user.firstName} {user.lastName}
					</span>
					<br />
					<span>{user.userName}</span>
				</div>
				{/* <Image
				src="./images/icons/ellipsis_icon.svg"
				alt="icon"
				width={20}
				height={20}
			/> */}
			</Link>
		</li>
	);
}
