import Link from 'next/link';

import Badge from '@/components/ui/Badge';

import { deleteReviewAction } from './actions';

type Review = {
	id: number;
	rating: number;
	text: string;
	createdAt: number;
	movieId: number;
	movieTitle: string | null;
	movieYear: number | null;
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
								{review.movieTitle ?? `Movie #${review.movieId}`}
								{review.movieYear ? (
									<span className="text-white/55"> ({review.movieYear})</span>
								) : null}
							</h2>
							<p className="mt-1 text-xs text-white/60">{date}</p>
						</div>

						<div className="flex items-center gap-2">
							<Link
								href={`/reviews/${review.id}/edit`}
								className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:border-white/15 hover:bg-white/15 focus:ring-2 focus:ring-white/20 focus:outline-none"
							>
								Edit
							</Link>

							<form action={deleteReviewAction}>
								<input type="hidden" name="reviewId" value={review.id} />
								<button
									type="submit"
									className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 shadow-sm transition hover:border-red-500/40 hover:bg-red-500/15 focus:ring-2 focus:ring-red-500/30 focus:outline-none"
								>
									Delete
								</button>
							</form>

							<Badge
								tone={getTone(review.rating)}
								title={`Rating: ${review.rating}/100`}
							>
								{Math.round(review.rating)}/100
							</Badge>
						</div>
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
