import { csfd } from 'node-csfd-api';
import { eq, asc, desc, sql } from 'drizzle-orm';

import { type Movie, type NewMovie } from '@/lib/movies';
import { db } from '@/db/index';
import { movies } from '@/db/schema';

export const getAllMovies = async () =>
	db
		.select({ id: movies.id, title: movies.title, year: movies.year })
		.from(movies)
		.orderBy(asc(movies.title));

export const addMovieToLocalDB = async (movie: NewMovie) =>
	db.insert(movies).values(movie);

export const autoUpdateMovieRatings = async (movie: Movie) => {
	if (!isWithinLast24Hours(movie.csfdLastFetched)) {
		const updatedResult = await csfd.movie(movie.csfdId);

		await db
			.update(movies)
			.set({
				csfdRating: updatedResult.rating,
				csfdLastFetched: new Date().toISOString()
			})
			.where(eq(movies.id, movie.id));
	}

	if (isWithinLast24Hours(movie.tmdbLastFetched)) {
		// todo fetch for TMDB
	}
};

const isWithinLast24Hours = (value: string | null): boolean => {
	if (!value) return false;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return false;

	const cutoff = Date.now() - 24 * 60 * 60 * 1000;
	return date.getTime() >= cutoff;
};

export const getTopMovies = async (limit = 3) =>
	db
		.select({
			id: movies.id,
			title: movies.title,
			year: movies.year,

			localRating: movies.localRating,
			csfdRating: movies.csfdRating,
			tmdbRating: movies.tmdbRating,

			score: sql<number>`
        (
          coalesce(${movies.localRating}, 0) +
          coalesce(${movies.csfdRating}, 0) +
          coalesce(${movies.tmdbRating}, 0)
        ) / nullif(
          (case when ${movies.localRating} is null then 0 else 1 end) +
          (case when ${movies.csfdRating} is null then 0 else 1 end) +
          (case when ${movies.tmdbRating} is null then 0 else 1 end),
          0
        )
      `.as('score')
		})
		.from(movies)
		.where(
			sql`
        ${movies.localRating} is not null
        or ${movies.csfdRating} is not null
        or ${movies.tmdbRating} is not null
      `
		)
		.orderBy(desc(sql`score`), desc(movies.csfdLastFetched), desc(movies.id))
		.limit(limit);
