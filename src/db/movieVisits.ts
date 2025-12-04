import { desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { movieVisits, movies, users } from '@/db/schema';

export const trackMovieVisit = async (userId: number, movieId: number) => {
	const visitedAt = Math.floor(Date.now() / 1000);

	await db
		.insert(movieVisits)
		.values({ userId, movieId, visitedAt })
		.onConflictDoUpdate({
			target: [movieVisits.userId, movieVisits.movieId],
			set: { visitedAt }
		});
};

export const getRecentlyVisitedMoviesByEmail = async (
	email: string,
	limit = 20
) =>
	db
		.select({
			id: movies.id,
			title: movies.title,
			year: movies.year,
			visitedAt: movieVisits.visitedAt
		})
		.from(movieVisits)
		.innerJoin(users, eq(movieVisits.userId, users.id))
		.innerJoin(movies, eq(movieVisits.movieId, movies.id))
		.where(eq(users.email, email))
		.orderBy(desc(movieVisits.visitedAt))
		.limit(limit);
