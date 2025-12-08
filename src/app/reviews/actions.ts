'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';

import { createReview, deleteReview, updateReviewForUser } from '@/db/reviews';

export const createReviewAction = async (formData: FormData) => {
	const session = await getServerSession();

	if (!session?.user?.email) {
		throw new Error('Unauthorized');
	}

	const movieIdRaw = formData.get('movieId');
	const ratingRaw = formData.get('rating');
	const textRaw = formData.get('text');

	const movieId = Number(movieIdRaw);
	const rating = Number(ratingRaw);
	const text = typeof textRaw === 'string' ? textRaw.trim() : '';

	if (!Number.isInteger(movieId) || movieId <= 0) {
		throw new Error('Invalid movieId');
	}

	if (!Number.isInteger(rating) || rating < 1 || rating > 100) {
		throw new Error('Invalid rating');
	}

	if (!text.length) {
		throw new Error('Text is required');
	}

	await createReview(session.user.email, movieId, rating, text);

	revalidatePath('/reviews');
};

export const deleteReviewAction = async (formData: FormData) => {
	const reviewIdRaw = formData.get('reviewId');
	const reviewId = Number(reviewIdRaw);

	if (!Number.isInteger(reviewId) || reviewId <= 0) {
		throw new Error('Invalid reviewId');
	}

	await deleteReview(reviewId);

	revalidatePath('/reviews');
};

export const updateReviewAction = async (formData: FormData) => {
	const session = await getServerSession();

	if (!session?.user?.email) {
		throw new Error('Unauthorized');
	}

	const reviewIdRaw = formData.get('reviewId');
	const ratingRaw = formData.get('rating');
	const textRaw = formData.get('text');

	const reviewId = Number(reviewIdRaw);
	const rating = Number(ratingRaw);
	const text = typeof textRaw === 'string' ? textRaw.trim() : '';

	if (!Number.isInteger(reviewId) || reviewId <= 0) {
		throw new Error('Invalid reviewId');
	}

	if (!Number.isInteger(rating) || rating < 1 || rating > 100) {
		throw new Error('Invalid rating');
	}

	if (!text.length) {
		throw new Error('Text is required');
	}

	await updateReviewForUser(session.user.email, reviewId, rating, text);

	revalidatePath('/reviews');
	revalidatePath(`/reviews/${reviewId}/edit`);
};
