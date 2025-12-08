import Link from 'next/link';
import { getServerSession } from 'next-auth/next';

import { getUserReviews } from '@/db/reviews';

import Filters from './filters';
import List from './list';

type ReviewsPageProps = {
	searchParams: Promise<{
		movieId?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
};

const SORT_BY = ['createdAt', 'rating'] as const;
type SortBy = (typeof SORT_BY)[number];

const SORT_ORDER = ['asc', 'desc'] as const;
type SortOrder = (typeof SORT_ORDER)[number];

const isSortBy = (v: string | undefined): v is SortBy =>
	!!v && (SORT_BY as readonly string[]).includes(v);

const isSortOrder = (v: string | undefined): v is SortOrder =>
	!!v && (SORT_ORDER as readonly string[]).includes(v);

const ReviewsPage = async ({ searchParams }: ReviewsPageProps) => {
	const sp = await searchParams;

	const session = await getServerSession();

	if (!session?.user?.email) {
		return (
			<main className="items-top flex justify-center text-white">
				<div className="w-full max-w-md px-6 py-10">
					<div className="rounded-2xl bg-white/5 p-8 shadow-lg backdrop-blur-md">
						<p className="mb-6 text-sm text-white/80">Please log in.</p>
						<Link
							href="/login"
							className="block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Sign In
						</Link>
					</div>
				</div>
			</main>
		);
	}

	const movieFilter =
		typeof sp.movieId === 'string' && sp.movieId.length > 0
			? Number(sp.movieId)
			: undefined;

	const sortBy: SortBy = isSortBy(sp.sortBy) ? sp.sortBy : 'createdAt';
	const sortOrder: SortOrder = isSortOrder(sp.sortOrder)
		? sp.sortOrder
		: 'desc';

	const reviews = await getUserReviews(session.user.email, {
		movieId: Number.isFinite(movieFilter as number) ? movieFilter : undefined,
		sortBy,
		sortOrder
	});

	const movieList = [...new Set(reviews.map(r => r.movieId))].sort(
		(a, b) => a - b
	);

	return (
		<main className="relative min-h-screen bg-transparent text-white">
			<div className="mx-auto max-w-5xl px-6 py-10">
				<header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
							<span className="h-2 w-2 rounded-full bg-sky-400/80" />
							My activity
						</div>

						<h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
							My Reviews
						</h1>

						<p className="mt-2 text-sm text-white/60">
							Filter and sort your reviews. Quick overview, same vibe.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
							Total:{' '}
							<span className="font-semibold text-white">{reviews.length}</span>
						</div>

						<Link
							href="/reviews/create"
							className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-white/15 hover:bg-white/15 focus:ring-2 focus:ring-white/20 focus:outline-none"
						>
							Add Review
						</Link>
					</div>
				</header>
				<section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/15 hover:bg-white/[0.07]">
					<div className="mb-3 flex items-center justify-between gap-3">
						<div>
							<h2 className="text-base font-semibold text-white">Filters</h2>
							<p className="mt-1 text-xs text-white/60">
								Narrow down by movie and sorting options.
							</p>
						</div>
					</div>

					<Filters
						movieList={movieList}
						searchParams={{
							movieId: sp.movieId,
							sortBy,
							sortOrder
						}}
					/>
				</section>
				<section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/15 hover:bg-white/[0.07]">
					<div className="mb-3 flex items-center justify-between gap-3">
						<div>
							<h2 className="text-base font-semibold text-white">Results</h2>
							<p className="mt-1 text-xs text-white/60">
								Showing {reviews.length} review{reviews.length === 1 ? '' : 's'}
								.
							</p>
						</div>
					</div>

					<List reviews={reviews} />
				</section>
			</div>
		</main>
	);
};

export default ReviewsPage;
