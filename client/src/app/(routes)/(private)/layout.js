import Provider from "@/app/Provider";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

export default function PrivateLayout({ children }) {
	return (
		<>
			<Provider>
				<Header />
				{children}
				<Footer />
			</Provider>
		</>
	);
}
