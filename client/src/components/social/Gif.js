import styles from "@/styles/components/social/gif.module.css";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { montserrat } from "@/libs/fonts";
import Image from "next/image";

export default function Gif({ formRef, previewRef, setOpenGif, setIsWriting }) {
	const [searchTerms, setSearchTerms] = useState("");

	const [categories, setCategories] = useState([]);
	// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
	const gf = new GiphyFetch("rw22iw53ke3a38mTDAa2Cvtk095yBQYZ");

	// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
	const fetchGifs = (offset) => gf.search(searchTerms, { offset, limit: 10 });

	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await gf.categories();

				setCategories(data.data);
			} catch {}
		}
		fetchCategories();
	}, [categories]);

	function handleSearch(e) {
		e.preventDefault();
		setSearchTerms(e.target.value);
	}

	function handleClickGif(e) {
		const url = e.images.preview_webp.url;
		const preview = previewRef.current;
		const form = formRef.current;
		const input = document.createElement("input");
		const img = document.createElement("img");
		preview.appendChild(img);
		img.alt = "preview";
		img.src = url;
		form.appendChild(input);
		input.type = "text";
		input.name = "gif";
		input.id = "gif";
		input.value = url;
		input.hidden = true;
		setIsWriting(true);
		console.log(e.target);
		// addGif(e);
	}

	function addGif(e) {
		// const preview = document.getElementById("preview");
		// const parent = preview.parentElement;
		console.log(e.currentTarget);
	}
	return (
		<>
			<div className={styles.container}>
				<div className={styles.search}>
					{searchTerms && (
						<div className={styles.back} onClick={(e) => setSearchTerms("")}>
							<Image
								src={"/images/icons/back_icon.svg"}
								alt="icon"
								width={15}
								height={20}
							/>
						</div>
					)}
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Recherche des Gifs..."
						className={montserrat.className}
						onChange={handleSearch}
						value={searchTerms}
					/>
				</div>
				<div className={styles.content}>
					{searchTerms ? (
						<Grid
							width={410}
							columns={2}
							fetchGifs={fetchGifs}
							noLink={true}
							hideAttribution={true}
							gutter={10}
							borderRadius={8}
							key={searchTerms}
							onGifClick={handleClickGif}
						/>
					) : (
						<>
							{categories.map((cat, idx) => {
								console.log(cat.gif.images.preview_gif.url);
								return (
									<div
										className={styles.card}
										key={idx}
										onClick={(e) => setSearchTerms(cat.name)}>
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
						</>
					)}
				</div>
			</div>
			<div
				id="hiddenOverlay"
				onClick={(e) => {
					e.stopPropagation();
					setOpenGif(false);
				}}></div>
		</>
	);
}
