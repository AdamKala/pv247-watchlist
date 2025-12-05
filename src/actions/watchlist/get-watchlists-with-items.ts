'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import { getUserWatchlistsAndItems } from '@/db/watchlists';

export const getWatchlistsWithItemsAction = async () => {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;
	return await getUserWatchlistsAndItems(session.user.email);
};
