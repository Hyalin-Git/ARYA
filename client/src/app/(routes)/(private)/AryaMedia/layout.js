import Header from "@/layouts/Header";

import styles from "@/styles/pages/aryaMedia.module.css";
export default function AryaMediaLayout({ children }) {
	return <div className={styles.container}>{children}</div>;
}
