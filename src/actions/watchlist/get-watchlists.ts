'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import { getUserWatchlists } from '@/db/watchlists';

export const getWatchlistsAction = async () => {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;
	return await getUserWatchlists(session.user.email);
};
