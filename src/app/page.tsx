import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getLatestReviews } from '@/db/reviews';

type LatestReview = {
	id: number;
	movieId: number;
	rating: number;
	text: string;
	createdAt: string | null;
};

const Home = async () => {
	const session = await getServerSession(authOptions);

	const isLoggedIn = !!session;

	let latestReviews: LatestReview[] = [];

	if (isLoggedIn && session.user?.email) {
		latestReviews = await getLatestReviews(session.user.email, 2);
	}

	return (
		<main className="mx-auto max-w-7xl px-6 py-10">
			<h1 className="mb-10 text-start text-3xl font-bold text-white">
				Movie Tracker
			</h1>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				{isLoggedIn && (
					<div className="flex flex-col gap-6 lg:col-span-1">
						<div className="h-44 rounded-md bg-gray-700/50 p-4">
							<h2 className="mb-2 font-semibold">Latest reviews</h2>

							{latestReviews.length === 0 && (
								<p className="text-gray-400">No reviews yet</p>
							)}

							{latestReviews.map((review) => (
								<div key={review.id} className="mb-2 text-gray-300">
									<div className="font-semibold">
										Movie #{review.movieId} — {review.rating}/5
									</div>
									<div className="text-sm text-gray-500">
										{review.text.length > 40
											? `${review.text.slice(0, 40)}...`
											: review.text}
									</div>
								</div>
							))}
						</div>

						<div className="h-44 rounded-md bg-gray-700/50 p-4">
							<h2 className="mb-2 font-semibold">Last visited</h2>
							<p className="text-gray-300">Visit #1</p>
							<p className="text-gray-300">Visit #2</p>
						</div>
					</div>
				)}

				<div className={isLoggedIn ? 'lg:col-span-2' : 'lg:col-span-4'}>
					<div className="rounded-md bg-gray-700/50 p-6">
						<h2 className="mb-4 font-semibold">Top movies</h2>

						<div className="flex flex-col gap-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="flex h-32 items-center justify-center rounded-md bg-gray-600/40 text-gray-300"
								>
									Movie #{i} - placeholder
								</div>
							))}
						</div>
					</div>
				</div>

				{isLoggedIn && (
					<div className="lg:col-span-1">
						<div className="h-[400px] rounded-md bg-gray-700/50 p-4">
							<h2 className="mb-2 font-semibold">Continue watching</h2>
							<p className="mt-4 text-gray-300">Movie A - placeholder</p>
							<p className="text-gray-300">Movie B - placeholder</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default Home;
