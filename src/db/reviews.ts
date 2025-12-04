import { eq, and, desc, asc } from 'drizzle-orm';
import { reviews, users, movies } from './schema';
import { db } from './index';

export const getReviewsForMovie = async (movieId: number) =>
	await db
		.select({
			id: reviews.id,
			rating: reviews.rating,
			text: reviews.text,
			createdAt: reviews.createdAt,
			userName: users.name,
			userImage: users.image,
			movieId: movies.id
		})
		.from(reviews)
		.leftJoin(users, eq(reviews.userId, users.id))
		.where(eq(reviews.movieId, movieId));

export const getUserReviews = async (
	userEmail: string,
	options?: {
		movieId?: number;
		sortBy?: 'rating' | 'createdAt';
		sortOrder?: 'asc' | 'desc';
	}
) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) return [];

	const filters = [eq(reviews.userId, user.id)];

	if (options?.movieId) {
		filters.push(eq(reviews.movieId, options.movieId));
	}

	const whereClause = and(...filters);

	const sortColumn =
		options?.sortBy === 'rating' ? reviews.rating : reviews.createdAt;

	const order =
		options?.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

	return await db
		.select({
			id: reviews.id,
			rating: reviews.rating,
			text: reviews.text,
			createdAt: reviews.createdAt,
			movieId: reviews.movieId
		})
		.from(reviews)
		.where(whereClause)
		.orderBy(order);
};

export const createReview = async (
	userEmail: string,
	movieId: number,
	rating: number,
	text: string
) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) throw new Error('User not found.');

	await db.insert(reviews).values({
		userId: user.id,
		movieId,
		rating,
		text,
		createdAt: new Date().toISOString(),
	});
};

export const deleteReview = async (reviewId: number) => {
	await db.delete(reviews).where(eq(reviews.id, reviewId));
};

export const updateReview = async (
	reviewId: number,
	rating: number,
	text: string
) => {
	await db
		.update(reviews)
		.set({ rating, text })
		.where(eq(reviews.id, reviewId));
};

export const getLatestReviews = async (userEmail: string, limit = 2) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, userEmail))
		.get();

	if (!user) return [];

	return db
		.select({
			id: reviews.id,
			rating: reviews.rating,
			text: reviews.text,
			createdAt: reviews.createdAt,
			movieId: reviews.movieId
		})
		.from(reviews)
		.where(eq(reviews.userId, user.id))
		.orderBy(desc(reviews.createdAt))
		.limit(limit);
};
