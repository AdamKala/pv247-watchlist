'use client';

import type { MovieSearchItemProps } from '@/lib/movies';

type SelectedMoviesListProps = {
	movies: MovieSearchItemProps[];
	onDeleteMovie: (movie: MovieSearchItemProps) => void;
};

const SelectedMoviesList = ({
	movies,
	onDeleteMovie
}: SelectedMoviesListProps) => {
	if (movies.length === 0) return null;

	return (
		<ul className="mb-2 flex flex-col gap-1">
			{movies.map(m => (
				<li
					key={`${m.type}-${m.id}`}
					className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2"
				>
					<span>{m.title}</span>
					<button
						type="button"
						onClick={() => onDeleteMovie(m)}
						className="rounded-lg bg-red-600 px-2 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
					>
						Delete
					</button>
				</li>
			))}
		</ul>
	);
};

export default SelectedMoviesList;
