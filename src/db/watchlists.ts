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
			movieId: watchlistItems.movieId,
			watchlistName: watchlists.name
		})
		.from(watchlistItems)
		.leftJoin(watchlists, eq(watchlistItems.watchlistId, watchlists.id))
		.where(eq(watchlists.userId, user.id));

	return movies;
};

export const getUserWatchlists = async (userEmail: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) return [];

	const watchlistData = await db
		.select({
			id: watchlists.id,
			name: watchlists.name,
			description: watchlists.description,
			favourite: watchlists.favourite
		})
		.from(watchlists)
		.where(eq(watchlists.userId, user.id));

	const watchlistsWithMovies = await Promise.all(
		watchlistData.map(async watchlist => {
			const movies = await db
				.select()
				.from(watchlistItems)
				.where(eq(watchlistItems.watchlistId, watchlist.id));
			return { ...watchlist, movies: movies.length };
		})
	);

	return watchlistsWithMovies;
};

export const deleteWatchlist = async (watchlistId: number) => {
	await db.delete(watchlists).where(eq(watchlists.id, watchlistId));
};

export const toggleFavouriteWatchlist = async (
	watchlistId: number,
	isFavourite: boolean
) => {
	await db
		.update(watchlists)
		.set({ favourite: isFavourite ? 1 : 0 })
		.where(eq(watchlists.id, watchlistId));
};
