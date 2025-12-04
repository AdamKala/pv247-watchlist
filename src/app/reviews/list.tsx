type Review = {
	id: number;
	rating: number;
	text: string;
	createdAt: number;
	movieId: number;
};

type ListProps = {
	reviews: Review[];
};

const List = ({ reviews }: ListProps) => (
	<div className="flex flex-col gap-6">
		{reviews.map(review => {
			const date = review.createdAt
				? new Date(review.createdAt).toLocaleDateString()
				: 'Unknown date';

			return (
				<div
					key={review.id}
					className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md"
				>
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">{review.movieId}</h2>
						<span className="text-yellow-400">{review.rating}/100</span>
					</div>

					<p className="mt-3 text-gray-300">{review.text}</p>

					<p className="mt-2 text-xs text-gray-500">{date}</p>
				</div>
			);
		})}
	</div>
);

export default List;
