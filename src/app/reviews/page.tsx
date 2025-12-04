import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { getUserReviews } from '@/db/reviews';

import Filters from './filters';
import List from './list';

type ReviewsPageProps = {
	searchParams: {
		movieId?: string;
		sortBy?: 'createdAt' | 'rating';
		sortOrder?: 'asc' | 'desc';
	};
};

const ReviewsPage = async ({ searchParams }: ReviewsPageProps) => {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return <div className="p-10 text-white">Please log in.</div>;
	}

	const movieFilter = searchParams.movieId
		? Number(searchParams.movieId)
		: undefined;

	const sortBy = (searchParams.sortBy as 'createdAt' | 'rating') ?? 'createdAt';
	const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') ?? 'desc';

	const reviews = await getUserReviews(session.user.email, {
		movieId: movieFilter,
		sortBy,
		sortOrder
	});

	const movieList = [...new Set(reviews.map(r => r.movieId))];

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
					movieId: searchParams.movieId,
					sortBy,
					sortOrder
				}}
			/>

			<List reviews={reviews} />
		</div>
	);
};

export default ReviewsPage;
