'use client';

type Movie = {
	id: number;
	itemSymbol: string;
	watchlistName: string | null;
};

const MovieList = ({ movies }: { movies: Movie[] }) => (
	<div>
		<ul className="space-y-2">
			{movies.map(movie => (
				<li key={movie.id} className="rounded border p-2">
					<strong>{movie.itemSymbol}</strong> — {movie.watchlistName}
				</li>
			))}
		</ul>
	</div>
);

export default MovieList;
