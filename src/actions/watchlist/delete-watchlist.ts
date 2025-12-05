'use server';

import { deleteWatchlist } from '@/db/watchlists';

export const deleteUserWatchlistAction = async (watchlistId: number) =>
	await deleteWatchlist(watchlistId);
