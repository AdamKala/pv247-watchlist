'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import type { MovieSearchItemProps } from '@/lib/movies';

import MovieSearchInput from './movie-search-input';
import SelectedMoviesList from './selected-movie-list';

const watchlistSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional()
});

export type WatchlistFormData = z.infer<typeof watchlistSchema>;

type WatchlistFormProps = {
	initialData?: {
		name: string;
		description?: string;
		movies?: MovieSearchItemProps[];
	};
	onSubmit: (
		data: WatchlistFormData,
		movies: MovieSearchItemProps[]
	) => Promise<void>;
};

const WatchlistForm = ({ initialData, onSubmit }: WatchlistFormProps) => {
	const router = useRouter();
	const form = useForm<WatchlistFormData>({
		resolver: zodResolver(watchlistSchema),
		defaultValues: {
			name: initialData?.name ?? '',
			description: initialData?.description ?? ''
		}
	});

	const [movies, setMovies] = useState<MovieSearchItemProps[]>(
		initialData?.movies ?? []
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddMovie = (movie: MovieSearchItemProps) => {
		if (!movie || movies.find(m => m.id === movie.id && m.type === movie.type))
			return;
		setMovies(prev => [...prev, movie]);
	};

	const handleDeleteMovie = (movie: MovieSearchItemProps) => {
		setMovies(prev =>
			prev.filter(m => m.id !== movie.id || m.type !== movie.type)
		);
	};

	const submitForm = async (data: WatchlistFormData) => {
		setIsSubmitting(true);
		await onSubmit(data, movies);
		setIsSubmitting(false);
	};

	return (
		<div className="flex w-full flex-col gap-6 overflow-visible rounded-xl bg-black p-6 text-white shadow-lg">
			<h1 className="text-3xl font-bold text-white">
				{initialData ? 'Edit Watchlist' : 'Create New Watchlist'}
			</h1>

			<form
				onSubmit={form.handleSubmit(submitForm)}
				className="flex flex-col gap-4 overflow-visible"
			>
				<div className="flex flex-col gap-2">
					<label htmlFor="name" className="font-semibold text-white">
						Watchlist Name
					</label>
					<input
						id="name"
						type="text"
						{...form.register('name')}
						placeholder="Enter watchlist name"
						className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
					/>
					{form.formState.errors.name && (
						<p className="text-sm text-red-500">
							{form.formState.errors.name.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="description" className="font-semibold text-white">
						Description
					</label>
					<textarea
						id="description"
						{...form.register('description')}
						rows={3}
						placeholder="Optional description..."
						className="w-full resize-none rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
					/>
				</div>

				<MovieSearchInput onSelectMovie={handleAddMovie} />
				<SelectedMoviesList movies={movies} onDeleteMovie={handleDeleteMovie} />

				<div className="mt-4 flex gap-4">
					<button
						type="submit"
						className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700"
					>
						{isSubmitting
							? 'Saving...'
							: initialData
								? 'Save Changes'
								: 'Create Watchlist'}
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 font-semibold transition hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default WatchlistForm;
