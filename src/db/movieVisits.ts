import {and, desc, eq} from 'drizzle-orm';

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


export const isMovieWatchedBy = async (userEmail: string, movieId: number) => {
    const data = await db
        .select({
            movieSeenAt: movieVisits.movieSeenAt,
        })
        .from(movieVisits)
        .innerJoin(users, eq(movieVisits.userId, users.id))
        .where(eq(users.email, userEmail))
        .limit(1)

    return data[0]
}

export const setMovieWatchedAt = async (userEmail: string, movieId: number, date: number) : Promise<void> => {

    const userId = db.select({id: users.id}).from(users).where(eq(users.email, userEmail));

    if (!userId) throw new Error(`User ${userId} not found`);

    db
        .update(movieVisits)
        .set({ movieSeenAt: date })
        .where(
            and(
                eq(movieVisits.movieId, movieId),
                eq(movieVisits.userId, userId)
            ));
}

export const resetMovieWatchedAt = async (userEmail: string, movieId: number) : Promise<void> => {
    const userId = db.select({id: users.id}).from(users).where(eq(users.email, userEmail));

    if (!userId) throw new Error(`User ${userId} not found`);

    db.update(movieVisits).set({ movieSeenAt: null }).where(and(eq(movieVisits.movieId, movieId), eq(movieVisits.userId, userId)));
}