'use server';

import { revalidatePath } from 'next/cache';

import { createWatchlist } from '@/db/watchlists';
import type { MovieSearchItemProps } from '@/lib/movies';

export const createWatchlistAction = async (
	userEmail: string,
	name: string,
	description: string | null,
	movies: MovieSearchItemProps[]
) => {
	await createWatchlist(userEmail, name, description, movies);
	revalidatePath('/profile');
};
