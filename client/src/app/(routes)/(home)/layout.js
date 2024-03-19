import Header from "@/layouts/Header";

export default function HomeLayout({ children }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
