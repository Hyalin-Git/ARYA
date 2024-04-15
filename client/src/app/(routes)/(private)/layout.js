import Provider from "@/app/Provider";

export default function PrivateLayout({ children }) {
	return <Provider>{children}</Provider>;
}
