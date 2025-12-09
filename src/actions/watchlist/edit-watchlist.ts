'use server';

import { revalidatePath } from 'next/cache';

import { editWatchlist } from '@/db/watchlists';
import type { MovieSearchItemProps } from '@/lib/movies';

export const editWatchlistAction = async (
	userEmail: string,
	name: string,
	description: string | null,
	movies: MovieSearchItemProps[],
	watchlistId: number
) => {
	await editWatchlist(userEmail, name, description, movies, watchlistId);
	revalidatePath('/watchlists');
};
