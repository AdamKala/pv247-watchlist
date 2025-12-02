"use client";

import { useState } from "react";
import { createReviewAction } from "../actions";

const CreateReviewPage = () => {
	const [rating, setRating] = useState(3);
	const [movieId, setMovieId] = useState("");
	const [text, setText] = useState("");

	const handleAction = async (formData: FormData) => {
		await createReviewAction(formData);

		setRating(3);
		setMovieId("");
		setText("");
	};

	return (
		<div className="mx-auto mt-16 max-w-xl p-4 text-white">
			<h1 className="mb-6 text-3xl font-bold">Create Review</h1>

			<form action={handleAction} className="flex flex-col gap-4">
				<select
					name="movieId"
					value={movieId}
					onChange={(e) => setMovieId(e.target.value)}
					className="rounded bg-gray-800 p-2 text-white"
					required
				>
					<option value="">Select movie (placeholder)</option>
					<option value="1">Movie #1</option>
					<option value="2">Movie #2</option>
					<option value="3">Movie #3</option>
				</select>

				<input type="hidden" name="rating" value={rating} />

				<div className="flex gap-2">
					{[1, 2, 3, 4, 5].map((star) => (
						<span
							key={star}
							onClick={() => setRating(star)}
							className={
								"cursor-pointer text-3xl " +
								(star <= rating ? "text-yellow-400" : "text-gray-500")
							}
						>
							★
						</span>
					))}
				</div>

				<textarea
					name="text"
					placeholder="Your review..."
					value={text}
					onChange={(e) => setText(e.target.value)}
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
