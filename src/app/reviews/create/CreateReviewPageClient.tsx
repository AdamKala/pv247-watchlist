'use client';

import { useState } from 'react';

import { createReviewAction } from '../actions';

type MovieOption = { id: number; title: string; year: number | null };

type Props = {
	movies: MovieOption[];
};

const CreateReviewPageClient = ({ movies }: Props) => {
	const [rating, setRating] = useState(50);
	const [movieId, setMovieId] = useState('');
	const [text, setText] = useState('');

	const handleAction = async (formData: FormData) => {
		await createReviewAction(formData);
		setRating(60);
		setMovieId('');
		setText('');
	};

	return (
		<div className="mx-auto mt-16 max-w-xl p-4 text-white">
			<h1 className="mb-6 text-3xl font-bold">Create Review</h1>

			<form action={handleAction} className="flex flex-col gap-4">
				<select
					name="movieId"
					value={movieId}
					onChange={e => setMovieId(e.target.value)}
					className="rounded bg-gray-800 p-2 text-white"
					required
				>
					<option value="">Select movie</option>
					{movies.map(m => (
						<option key={m.id} value={String(m.id)}>
							{m.title}
							{m.year ? ` (${m.year})` : ''}
						</option>
					))}
				</select>

				<input type="hidden" name="rating" value={String(rating)} />

				<div className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<label
							htmlFor="rating"
							className="text-sm font-medium text-gray-200"
						>
							Rating
						</label>
						<span className="text-lg font-semibold text-yellow-400">
							{rating}%
						</span>
					</div>

					<input
						id="rating"
						type="range"
						min={0}
						max={100}
						step={1}
						value={rating}
						onChange={e => setRating(Number(e.target.value))}
						className="w-full cursor-pointer accent-yellow-400"
						aria-label="Rating in percent"
					/>

					<div className="flex justify-between text-xs text-gray-400">
						<span>0%</span>
						<span>50%</span>
						<span>100%</span>
					</div>
				</div>

				<textarea
					name="text"
					placeholder="Your review..."
					value={text}
					onChange={e => setText(e.target.value)}
					className="h-32 rounded bg-gray-800 p-2 text-white"
					required
				/>

				<button
					type="submit"
					className="cursor-pointer rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
				>
					Submit Review
				</button>
			</form>
		</div>
	);
};

export default CreateReviewPageClient;
