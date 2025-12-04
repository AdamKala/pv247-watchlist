'use client';

import { type Key, useEffect, useState } from 'react';

import MovieSearchItem from '@/components/movies/movie-search-item';

const SearchPage = () => {
	const defaultState = {
		movies: [],
		tvSeries: []
	};

	const [input, setInput] = useState('');
	const [results, setResults] = useState(defaultState);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!input.trim()) {
			setResults(defaultState);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/search/csfd?q=${encodeURIComponent(input)}`);
				if (!res.ok) {
					throw new Error('Failed to fetch csfd results');
				}
				const data = await res.json();
				setResults(data.results ?? {});
				console.log(data.results);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [input]);

	return (
		<main className="container flex h-full min-h-[400px] flex-col items-center justify-center py-10 text-center">
			<input
				value={input}
				onChange={e => setInput(e.target.value)}
				name="movieTitle"
				placeholder="Movie/Show title"
				className="rounded-md border border-gray-700 bg-gray-50 px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600"
				required
			/>

			<h1 className="my-6 text-3xl font-bold">Search Movies</h1>
			<p className="text-lg text-gray-600">
				Use the search bar above to find movies and add them to your watchlist.
			</p>

			{isLoading && <p className="mt-4 text-sm text-gray-500">Searching…</p>}

			<div className="container mt-4 max-w-2/4 text-left">
				{results.movies && (
					<h2 className="my-4 text-center text-3xl font-bold text-white">
						Movies
					</h2>
				)}
				{results.movies.map(
					(
						item: {
							origins: string[];
							title: string;
							poster: string;
							id: number;
							year: string;
						},
						idx: Key | null | undefined
					) => (
						<MovieSearchItem
							key={idx}
							title={item.title}
							posterUrl={item.poster}
							id={item.id}
							origins={item.origins}
							type="movie"
							year={item.year}
						/>
					)
				)}
			</div>
			<div className="container mt-4 max-w-2/4 text-left">
				{results.tvSeries && (
					<h2 className="my-4 text-center text-3xl font-bold text-white">
						TV Series
					</h2>
				)}
				{results.tvSeries.map(
					(
						item: {
							title: string;
							poster: string;
							id: number;
							origins: string[];
							year: string;
						},
						idx: Key | null | undefined
					) => (
						<MovieSearchItem
							key={idx}
							title={item.title}
							posterUrl={item.poster}
							id={item.id}
							origins={item.origins}
							type="series"
							year={item.year}
						/>
					)
				)}
			</div>
		</main>
	);
};

export default SearchPage;
