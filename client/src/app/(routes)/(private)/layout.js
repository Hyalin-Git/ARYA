import Provider from "@/app/Provider";
import Header from "@/layouts/Header";

export default function PrivateLayout({ children }) {
	return (
		<>
			<Provider>
				<Header />
				{children}
			</Provider>
		</>
	);
}
