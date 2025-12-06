'use server';

import { addMovieToWatchlist } from '@/db/watchlists';
import type { MovieSearchItemProps } from '@/lib/movies';

export const addToWatchlistAction = async (
	watchlistId: number,
	movieData: MovieSearchItemProps
) => await addMovieToWatchlist(watchlistId, movieData);
