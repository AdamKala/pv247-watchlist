'use client';

import { type Key, useEffect, useState } from 'react';

import MovieSearchItem from '@/components/movies/movie-search-item';
import { useWatchlistContext } from '@/context/watchlist-context';
import { getWatchlistsAction } from '@/actions/watchlist/get-watchlists';

const SearchPage = () => {
	const defaultState = {
		movies: [],
		tvSeries: []
	};

	const { setWatchlists } = useWatchlistContext();
	useEffect(() => {
		const fetchWatchlists = async () => {
			const lists = await getWatchlistsAction();
			setWatchlists(lists ?? null);
		};

		fetchWatchlists();
	}, [setWatchlists]);

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
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}, 600);

		return () => clearTimeout(timeoutId);
	}, [input]);

	return (
		<main className="container flex w-full flex-col items-center py-10 text-white">
			<div className="flex w-full max-w-xl flex-col gap-4">
				<h1 className="text-center text-4xl font-bold text-white">
					Search Movies & TV Shows
				</h1>
				<p className="text-center text-gray-400">
					Find content and add it to your watchlist.
				</p>

				<input
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder="Search for a movie or show..."
					className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white ring-0 outline-none focus:ring-2 focus:ring-blue-600"
				/>

				{isLoading && (
					<p className="text-center text-sm text-gray-400">Searching…</p>
				)}
			</div>

			<div className="mt-10 w-full max-w-3xl">
				{results.movies.length > 0 && (
					<>
						<h2 className="my-6 text-center text-3xl font-bold text-white">
							Movies
						</h2>
						<div className="flex flex-col gap-4">
							{results.movies.map(
								(
									item: {
										origins: string[];
										title: string;
										poster: string;
										id: number;
										year: string;
										csfdId: number;
									},
									idx: Key
								) => (
									<MovieSearchItem
										key={idx}
										title={item.title}
										posterUrl={item.poster}
										id={item.id}
										origins={item.origins}
										csfdId={item.id}
										type="movie"
										year={item.year}
									/>
								)
							)}
						</div>
					</>
				)}

				{results.tvSeries.length > 0 && (
					<>
						<h2 className="my-6 mt-10 text-center text-3xl font-bold text-white">
							TV Series
						</h2>
						<div className="flex flex-col gap-4">
							{results.tvSeries.map(
								(
									item: {
										origins: string[];
										title: string;
										poster: string;
										id: number;
										year: string;
										csfdId: number;
									},
									idx: Key
								) => (
									<MovieSearchItem
										key={idx}
										title={item.title}
										posterUrl={item.poster}
										id={item.id}
										csfdId={item.id}
										origins={item.origins}
										type="series"
										year={item.year}
									/>
								)
							)}
						</div>
					</>
				)}
			</div>
		</main>
	);
};

export default SearchPage;
