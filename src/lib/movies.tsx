type Movie = {
	id: number;
	itemSymbol: string;
	watchlistName: string | null;
};

type Watchlist = {
	id: number;
	name: string;
	description: string | null;
	movies: number;
	favourite: number | null;
};

export type { Movie, Watchlist };
