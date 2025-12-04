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
	};
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
		return <div className="p-10 text-white">Please log in.</div>;
	}

	const movieFilter =
		typeof searchParams.movieId === 'string' && searchParams.movieId.length > 0
			? Number(searchParams.movieId)
			: undefined;

	const sortBy: SortBy = isSortBy(searchParams.sortBy) ? searchParams.sortBy : 'createdAt';
	const sortOrder: SortOrder = isSortOrder(searchParams.sortOrder) ? searchParams.sortOrder : 'desc';

	const reviews = await getUserReviews(session.user.email, {
		movieId: Number.isFinite(movieFilter as number) ? movieFilter : undefined,
		sortBy,
		sortOrder,
	});

	const movieList = [...new Set(reviews.map((r) => r.movieId))].sort((a, b) => a - b);

	return (
		<div className="mx-auto mt-16 max-w-5xl p-4 text-white">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold">My Reviews</h1>

				<Link
					href="/reviews/create"
					className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
				>
					Add Review
				</Link>
			</div>

			<Filters
				movieList={movieList}
				searchParams={{
					movieId: sp.movieId,
					sortBy,
					sortOrder,
				}}
			/>

			<List reviews={reviews} />
		</div>
	);
};

export default ReviewsPage;
