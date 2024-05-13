import styles from "@/styles/components/social/gif.module.css";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { montserrat } from "@/libs/fonts";
import Image from "next/image";
export default function Gif() {
	const [searchTerms, setSearchTerms] = useState("");
	const [categories, setCategories] = useState([]);
	// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
	const gf = new GiphyFetch("rw22iw53ke3a38mTDAa2Cvtk095yBQYZ");

	// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
	// const fetchGifs = (offset) => gf.subcategories({ offset, limit: 10 });
	// console.log(fetchGifs);
	async function fetchCategories() {
		try {
			const data = await gf.categories();

			return data;
		} catch {}
	}
	// async function fetchedNormal() {
	// 	try {
	// 		const fetchGifs = async (offset) =>
	// 			await gf.trending({ offset, limit: 10 });
	// 		console.log(fetchGifs);
	// 	} catch {}
	// }
	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await gf.categories({ lang: "fr" });

				setCategories(data.data);
			} catch {}
		}
		fetchCategories();
	}, [categories]);

	// fetchedNormal();
	console.log(categories);
	return (
		<>
			<div className={styles.container}>
				<div className={styles.search}>
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Cherche un Gif..."
						className={montserrat.className}
					/>
				</div>
				<div className={styles.content}>
					{categories.map((cat) => {
						console.log(cat.gif.images.preview_gif.url);
						return (
							<div className={styles.card}>
								<span>{cat.name}</span>
								<Image
									src={cat.gif.images.preview_webp.url}
									width={200}
									height={100}
									quality={100}
									alt="icon"
								/>
							</div>
						);
					})}

					{/* <Grid width={200} columns={2} fetchGifs={fetchedCat} /> */}
				</div>
			</div>
			{/* <div id="overlay"></div> */}
		</>
	);
}
