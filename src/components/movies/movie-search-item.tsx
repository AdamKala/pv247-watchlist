import { type JSX } from 'react';

import { type MovieSearchItemProps } from '@/lib/movies';

const MovieSearchItem: (movieData: MovieSearchItemProps) => JSX.Element = (
	movieData: MovieSearchItemProps
) => {
	const handleAddToDb = async () => {
		try {
			const res = await fetch('/search/csfd', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: movieData.title,
					image: movieData.posterUrl,
					csfdId: movieData.id,
					year: movieData.year,
					type: movieData.type,
					origins: movieData.origins
				})
			});

			if (!res.ok) {
				console.error(
					'Failed to save movie',
					await res.json().catch(() => ({}))
				);
				return;
			}
			console.log('Saved to local DB:', movieData);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="my-2 grid grid-cols-4">
			<img
				className="h-[100px] w-[100px] object-contain"
				src={movieData.posterUrl}
				alt={`movie-poster-${movieData.title}`}
			/>
			<div className="col-span-2">
				<h2 className="text-xl font-bold text-gray-50">{movieData.title}</h2>
				<div className="text-gray-200">{movieData.year}</div>
				<div className="text-gray-400">
					{movieData.origins.map(origin => (
						<span key={origin}>{origin}</span>
					))}
				</div>
			</div>
			<div>
				<button
					className="btn mr-2 cursor-pointer rounded-2xl bg-green-800 px-4 py-1 font-bold text-gray-300 hover:bg-green-950"
					onClick={() => handleAddToDb()}
				>
					Přidat
				</button>
			</div>
		</div>
	);
};

export default MovieSearchItem;
