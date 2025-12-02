'use server';

import { createReview } from '@/db/reviews';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

export const createReviewAction = async (formData: FormData) => {
	const session = await getServerSession();

	if (!session?.user?.email) {
		throw new Error('Unauthorized');
	}

	const movieId = Number(formData.get('movieId'));
	const rating = Number(formData.get('rating'));
	const text = String(formData.get('text'));

	if (!movieId || !rating || !text.length) {
		throw new Error('Invalid form data');
	}

	await createReview(session.user.email, movieId, rating, text);

	revalidatePath('/reviews');
};
