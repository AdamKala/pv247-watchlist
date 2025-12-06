'use server';

import { toggleFavouriteWatchlist } from '@/db/watchlists';

export const favouriteWatchlistAction = async (
	watchlistId: number,
	isFavourite: boolean
) => await toggleFavouriteWatchlist(watchlistId, isFavourite);
