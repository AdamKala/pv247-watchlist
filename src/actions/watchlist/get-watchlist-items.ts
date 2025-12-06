'use server';

import { getWatchlistItems } from '@/db/watchlists';

export const getWatchlistItemsAction = async (watchlistId: string) =>
	await getWatchlistItems(watchlistId);
