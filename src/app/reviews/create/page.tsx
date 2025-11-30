'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateReviewPage = () => {
	const [movieId, setMovieId] = useState('');
	const [rating, setRating] = useState(3);
	const [text, setText] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetch('/api/reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				movieId: Number(movieId),
				rating,
				text
			})
		});

		router.push('/reviews');
	};

	return (
		<div className="mx-auto mt-16 max-w-xl p-4 text-white">
			<h1 className="mb-6 text-3xl font-bold">Create Review</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<select
					value={movieId}
					onChange={e => setMovieId(e.target.value)}
					className="rounded bg-gray-800 p-2 text-white"
					required
				>
					<option value="">Select movie (placeholder)</option>
					<option value="1">Movie #1 (placeholder)</option>
					<option value="2">Movie #2 (placeholder)</option>
					<option value="3">Movie #3 (placeholder)</option>
				</select>

				<div className="flex gap-2">
					{[1, 2, 3, 4, 5].map(star => (
						<button
							key={star}
							type="button"
							onClick={() => setRating(star)}
							className={
								star <= rating
									? 'cursor-pointer text-3xl text-yellow-400'
									: 'cursor-pointer text-3xl text-gray-500'
							}
						>
							★
						</button>
					))}
				</div>

				<textarea
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

export default CreateReviewPage;
