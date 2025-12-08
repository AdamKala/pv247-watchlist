'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

import { updateReviewAction } from '../../actions';

type Review = {
	id: number;
	rating: number;
	text: string;
	createdAt: number;
	movieId: number;
	movieTitle: string | null;
	movieYear: number | null;
};

type Props = {
	review: Review;
};

const toneFromRating = (v: number) => {
	if (v >= 85) return 'success';
	if (v >= 70) return 'info';
	if (v >= 50) return 'warning';
	return 'danger';
};

const EditReviewPageClient = ({ review }: Props) => {
	const router = useRouter();

	const [rating, setRating] = useState<number>(Math.round(review.rating));
	const [text, setText] = useState<string>(review.text ?? '');

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showToast, setShowToast] = useState(false);

	const movieLabel = useMemo(
		() =>
			`${review.movieTitle ?? `Movie #${review.movieId}`}${
				review.movieYear ? ` (${review.movieYear})` : ''
			}`,
		[review.movieId, review.movieTitle, review.movieYear]
	);

	const handleAction = async (formData: FormData) => {
		try {
			setIsSubmitting(true);

			await updateReviewAction(formData);

			setShowToast(true);

			window.setTimeout(() => {
				router.push('/reviews');
				router.refresh();
			}, 900);
		} finally {
			window.setTimeout(() => setIsSubmitting(false), 900);
		}
	};

	return (
		<main className="relative min-h-screen bg-transparent text-white">
			<div
				className={[
					'pointer-events-none fixed top-6 left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 transition',
					showToast ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
				].join(' ')}
				aria-hidden={!showToast}
			>
				<div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0B1020]/80 p-4 shadow-lg backdrop-blur">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3">
							<div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
							<div>
								<p className="text-sm font-semibold text-white">
									Review updated
								</p>
								<p className="mt-0.5 text-xs text-white/60">
									Redirecting to{' '}
									<span className="text-white/80">My Reviews</span>…
								</p>
							</div>
						</div>

						<span className="text-xs text-white/50">/reviews</span>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-2xl px-6 py-10">
				<header className="mb-6">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
						<span className="h-2 w-2 rounded-full bg-sky-400/80" />
						Edit review
					</div>

					<h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
						Edit Review
					</h1>

					<p className="mt-2 text-sm text-white/60">{movieLabel}</p>
				</header>

				<Card>
					<form action={handleAction} className="flex flex-col gap-5">
						<input type="hidden" name="reviewId" value={String(review.id)} />
						<input type="hidden" name="rating" value={String(rating)} />

						<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
							<div className="mb-3 flex items-baseline justify-between gap-4">
								<label
									htmlFor="rating"
									className="text-xs font-medium text-white/70"
								>
									Rating
								</label>

								<Badge
									tone={toneFromRating(rating)}
									title={`Rating: ${rating}/100`}
								>
									{rating}/100
								</Badge>
							</div>

							<input
								id="rating"
								type="range"
								min={0}
								max={100}
								step={1}
								value={rating}
								onChange={e => setRating(Number(e.target.value))}
								className="w-full cursor-pointer accent-white disabled:cursor-not-allowed disabled:opacity-60"
								aria-label="Rating"
								disabled={isSubmitting}
							/>

							<div className="mt-2 flex justify-between text-[11px] text-white/50">
								<span>0</span>
								<span>50</span>
								<span>100</span>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="text"
								className="text-xs font-medium text-white/70"
							>
								Review text
							</label>

							<textarea
								id="text"
								name="text"
								placeholder="Your review..."
								value={text}
								onChange={e => setText(e.target.value)}
								className="h-36 resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition outline-none placeholder:text-white/40 hover:border-white/15 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-60"
								required
								disabled={isSubmitting}
							/>

							<div className="flex items-center justify-between text-[11px] text-white/50">
								<span>One or two sentences is enough.</span>
								<span>{text.length} chars</span>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-white/15 hover:bg-white/15 focus:ring-2 focus:ring-white/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? 'Submitting…' : 'Save changes'}
						</button>
					</form>
				</Card>
			</div>
		</main>
	);
};

export default EditReviewPageClient;
