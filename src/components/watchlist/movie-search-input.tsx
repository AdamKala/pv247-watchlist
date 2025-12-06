'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import type { MovieSearchItemProps } from '@/lib/movies';

type MovieSearchInputProps = {
	onSelectMovie: (movie: MovieSearchItemProps) => void;
};

const MovieSearchInput = ({ onSelectMovie }: MovieSearchInputProps) => {
	const [input, setInput] = useState('');
	const [suggestions, setSuggestions] = useState<MovieSearchItemProps[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!input.trim()) {
			setSuggestions([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/search/csfd?q=${encodeURIComponent(input)}`);
				if (!res.ok) throw new Error('Failed to fetch CSFD results');
				const data = await res.json();

				const movies = (data.results?.movies ?? []).map((movie: any) => ({
					...movie,
					posterUrl: movie.poster,
					type: 'movie'
				}));
				const tvSeries = (data.results?.tvSeries ?? []).map((show: any) => ({
					...show,
					posterUrl: show.poster,
					type: 'series'
				}));

				setSuggestions([...movies, ...tvSeries]);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [input]);

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="text"
				value={input}
				onChange={e => setInput(e.target.value)}
				placeholder="Type movie or show title..."
				className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
			/>
			{isLoading && (
				<div className="absolute top-2 right-2 text-sm text-gray-400">
					Loading...
				</div>
			)}

			{suggestions.length > 0 &&
				inputRef.current &&
				createPortal(
					<ul
						style={{
							position: 'absolute',
							top:
								inputRef.current.getBoundingClientRect().bottom +
								window.scrollY,
							left:
								inputRef.current.getBoundingClientRect().left + window.scrollX,
							width: inputRef.current.offsetWidth,
							maxHeight: '20rem'
						}}
						className="z-50 overflow-y-auto rounded-lg bg-gray-800/90 shadow-lg"
					>
						{suggestions.map(movie => (
							<li key={`${movie.type}-${movie.id}-${movie.title}`}>
								<button
									type="button"
									className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-700"
									onClick={() => {
										onSelectMovie(movie);
										setInput('');
										setSuggestions([]);
									}}
								>
									<Image
										src={movie.posterUrl ?? '/icons/default-movie.svg'}
										alt={movie.title}
										width={24}
										height={32}
										className="rounded-sm object-cover"
									/>
									<span className="truncate text-white">{movie.title}</span>
								</button>
							</li>
						))}
					</ul>,
					document.body
				)}
		</div>
	);
};

export default MovieSearchInput;
