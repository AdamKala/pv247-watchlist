'use server';

import { getWatchlistById } from '@/db/watchlists';

export const getWatchlistByIdAction = async (watchlistId: string) =>
	await getWatchlistById(parseInt(watchlistId, 10));
