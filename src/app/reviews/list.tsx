import Badge from '@/components/ui/Badge';

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

const getTone = (v: number) => {
	if (v >= 85) return 'success';
	if (v >= 70) return 'info';
	if (v >= 50) return 'warning';
	return 'danger';
};

const List = ({ reviews }: ListProps) => (
	<div className="flex flex-col gap-4">
		{reviews.map(review => {
			const date = review.createdAt
				? new Date(review.createdAt * 1000).toLocaleDateString('cs-CZ', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					})
				: 'Unknown date';

			return (
				<div
					key={review.id}
					className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur transition hover:border-white/15 hover:bg-white/[0.06]"
				>
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0">
							<h2 className="truncate text-sm font-semibold text-white">
								Movie #{review.movieId}
							</h2>
							<p className="mt-1 text-xs text-white/60">{date}</p>
						</div>

						<Badge
							tone={getTone(review.rating)}
							title={`Rating: ${review.rating}/100`}
						>
							{Math.round(review.rating)}/100
						</Badge>
					</div>

					{review.text ? (
						<p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-white/75">
							{review.text}
						</p>
					) : (
						<p className="mt-3 text-sm text-white/55">No text.</p>
					)}
				</div>
			);
		})}
	</div>
);

export default List;
