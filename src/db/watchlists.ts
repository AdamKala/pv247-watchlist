import { eq, and } from 'drizzle-orm';
import { csfd } from 'node-csfd-api';

import type { Movie, MovieSearchItemProps, NewMovie } from '@/lib/movies';
import { pullAndStoreFromCSFDId } from '@/actions/movies/pull-from-csfd';

import { watchlistItems, watchlists, users, movies } from './schema';
import { addMovieToLocalDB, getMovieByCSFDId, getMovieByTitle } from './movies';

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
			userId: watchlists.userId,
			name: watchlists.name,
			description: watchlists.description,
			favourite: watchlists.favourite,
			default: watchlists.default
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

export const getUserWatchlistsAndItems = async (userEmail: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) return [];

	const watchlistData = await db
		.select()
		.from(watchlists)
		.where(eq(watchlists.userId, user.id));

	const watchlistsWithMovies = await Promise.all(
		watchlistData.map(async watchlist => {
			const items = await db
				.select()
				.from(watchlistItems)
				.where(eq(watchlistItems.watchlistId, watchlist.id));
			const detailedItems = [];
			for (const item of items) {
				const movie = await db
					.select()
					.from(movies)
					.where(eq(movies.id, item.movieId))
					.get();

				if (movie) {
					detailedItems.push(movie);
				}
			}
			return { ...watchlist, movies: detailedItems };
		})
	);

	return watchlistsWithMovies;
};

export const getWatchlistItems = async (watchlistId: string) => {
	const items = await db
		.select()
		.from(watchlistItems)
		.where(eq(watchlistItems.watchlistId, parseInt(watchlistId, 10)));

	const detailedItems = [];
	for (const item of items) {
		const movie = await db
			.select()
			.from(movies)
			.where(eq(movies.id, item.movieId))
			.get();

		if (movie) {
			detailedItems.push(movie);
		}
	}

	return detailedItems;
};

export const editWatchlist = async (
	userEmail: string,
	name: string,
	description: string | null,
	movies: MovieSearchItemProps[],
	watchlistId: number
) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) throw new Error('User not found');

	const userId = user.id;

	const watchlist = await db
		.select()
		.from(watchlists)
		.where(and(eq(watchlists.userId, userId), eq(watchlists.id, watchlistId)))
		.get();

	if (!watchlist) throw new Error('Watchlist not found');

	await db
		.update(watchlists)
		.set({ description })
		.where(eq(watchlists.id, watchlist.id));

	await db
		.update(watchlists)
		.set({ name })
		.where(eq(watchlists.id, watchlist.id));

	const existingItems = await db
		.select()
		.from(watchlistItems)
		.where(eq(watchlistItems.watchlistId, watchlist.id));

	for (const item of existingItems) {
		const stillExists = movies.find(movie => movie.id === item.movieId);
		if (!stillExists) {
			await db
				.delete(watchlistItems)
				.where(
					and(
						eq(watchlistItems.watchlistId, watchlist.id),
						eq(watchlistItems.movieId, item.movieId)
					)
				);
		}
	}

	for (const movie of movies) {
		await addMovieToWatchlist(watchlist.id, movie);
	}
};

export const getWatchlistById = async (watchlistId: number) => {
	const watchlist = await db
		.select()
		.from(watchlists)
		.where(eq(watchlists.id, watchlistId))
		.get();

	return watchlist;
};

export const addMovieToWatchlist = async (
	watchlistId: number,
	movieData: MovieSearchItemProps
) => {
	let movie: Movie | undefined = await getMovieByTitle(movieData.title);

	movie ??= await pullAndStoreFromCSFDId(movieData.id, movieData.type);

	if (!movie) throw new Error('Movie was not added to local DB');

	const alreadyInWatchlist = await db
		.select()
		.from(watchlistItems)
		.where(
			and(
				eq(watchlistItems.watchlistId, watchlistId),
				eq(watchlistItems.movieId, movie.id)
			)
		)
		.get();

	if (alreadyInWatchlist) return;

	await db.insert(watchlistItems).values({
		watchlistId,
		movieId: movie.id
	});
};

export const createWatchlist = async (
	userEmail: string,
	name: string,
	description: string | null,
	movies: MovieSearchItemProps[]
) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) throw new Error('User not found');

	const userId = user.id;
	const watchlist = await db
		.insert(watchlists)
		.values({
			userId,
			name,
			description
		})
		.returning();

	for (const movie of movies) {
		await addMovieToWatchlist(watchlist[0].id, movie);
	}
};

export const deleteWatchlist = async (watchlistId: number) => {
	await db
		.delete(watchlistItems)
		.where(eq(watchlistItems.watchlistId, watchlistId));
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
