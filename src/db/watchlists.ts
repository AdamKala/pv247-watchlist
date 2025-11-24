import { eq } from 'drizzle-orm';

import { watchlistItems, watchlists, users } from './schema';

import { db } from './index';

export const getUserMovies = async (userEmail: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) return [];

	const movies = await db
		.select({
			id: watchlistItems.id,
			itemSymbol: watchlistItems.itemSymbol,
			watchlistName: watchlists.name
		})
		.from(watchlistItems)
		.leftJoin(watchlists, eq(watchlistItems.watchlistId, watchlists.id))
		.where(eq(watchlists.userId, user.id));

	return movies;
};
