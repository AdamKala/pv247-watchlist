import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getLatestReviews } from '@/db/reviews';
import { getTopMovies } from '@/db/movies';
import { getRecentlyVisitedMoviesByEmail } from '@/db/movieVisits';

type LatestReview = Awaited<ReturnType<typeof getLatestReviews>>[number];
type TopMovie = Awaited<ReturnType<typeof getTopMovies>>[number];
const topMovies: TopMovie[] = await getTopMovies(3);
type LastVisited = Awaited<ReturnType<typeof getRecentlyVisitedMoviesByEmail>>[number];

const Home = async () => {
	const session = await getServerSession(authOptions);

	const isLoggedIn = !!session;

	let latestReviews: LatestReview[] = [];
	let lastVisited: LastVisited[] = [];

	if (isLoggedIn && session.user?.email) {
		latestReviews = await getLatestReviews(session.user.email, 2);
		lastVisited = await getRecentlyVisitedMoviesByEmail(session.user.email, 2);
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

							{latestReviews.map(review => (
								<div key={review.id} className="mb-2 text-gray-300">
									<div className="font-semibold">
										{review.movieTitle ?? `Movie #${review.movieId}`}
										{review.movieYear ? ` (${review.movieYear})` : ''} —{' '}
										{review.rating}/100
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

							{lastVisited.length === 0 ? (
								<p className="text-gray-400">No visits yet</p>
							) : (
								lastVisited.map(v => (
									<div key={`${v.id}-${v.visitedAt}`} className="mb-2 text-gray-300">
										<div className="font-semibold">
											{v.title}
											{v.year ? ` (${v.year})` : ''}
										</div>
										<div className="text-sm text-gray-500">
											{new Date(v.visitedAt * 1000).toLocaleString('cs-CZ')}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}

				<div className={isLoggedIn ? 'lg:col-span-2' : 'lg:col-span-4'}>
					<div className="rounded-md bg-gray-700/50 p-6">
						<h2 className="mb-4 font-semibold">Top movies</h2>

						<div className="flex flex-col gap-4">
							{topMovies.length === 0 ? (
								<div className="flex h-32 items-center justify-center rounded-md bg-gray-600/40 text-gray-300">
									No rated movies yet
								</div>
							) : (
								topMovies.map((m) => (
									<div
										key={m.id}
										className="flex items-center justify-between rounded-md bg-gray-600/40 p-4 text-gray-300"
									>
										<div className="font-semibold">
											{m.title}
											{m.year ? ` (${m.year})` : ''}
										</div>

										<div className="text-sm text-gray-200">
											{Number(m.score).toFixed(1)}
										</div>
									</div>
								))
							)}
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
