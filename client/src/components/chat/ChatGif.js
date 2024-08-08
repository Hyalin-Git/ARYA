import styles from "@/styles/components/chat/chatGif.module.css";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { montserrat } from "@/libs/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ChatGif({ formRef, gifRef, setOpenGif }) {
	const [searchTerms, setSearchTerms] = useState("");

	const [categories, setCategories] = useState([]);
	// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
	const gf = new GiphyFetch("rw22iw53ke3a38mTDAa2Cvtk095yBQYZ");

	// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
	const fetchGifs = (offset) => gf.search(searchTerms, { offset, limit: 10 });

	function handleSearch(e) {
		e.preventDefault();
		setSearchTerms(e.target.value);
	}

	function handleSendGif(e) {
		const url = e.images.preview_webp.url;
		gifRef.current.value = url;

		formRef.current.requestSubmit();

		gifRef.current.value = "";
		setOpenGif(false);
	}

	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await gf.categories();

				setCategories(data.data);
			} catch {}
		}
		fetchCategories();
	}, [categories]);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.search}>
					{searchTerms && (
						<div onClick={(e) => setSearchTerms("")}>
							<FontAwesomeIcon icon={faArrowLeftLong} className={styles.back} />
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
							width={347}
							columns={2}
							fetchGifs={fetchGifs}
							noLink={true}
							hideAttribution={true}
							gutter={10}
							borderRadius={8}
							key={searchTerms}
							onGifClick={handleSendGif}
						/>
					) : (
						<>
							{categories.map((cat, idx) => {
								return (
									<div
										className={styles.card}
										key={idx}
										onClick={(e) => setSearchTerms(cat.name)}>
										<span>{cat.name}</span>
										<Image
											src={cat.gif.images.preview_webp.url}
											width={167}
											height={100}
											quality={100}
											alt="icon"
											unoptimized
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
