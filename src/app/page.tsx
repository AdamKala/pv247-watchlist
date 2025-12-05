import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import { getLatestReviews } from '@/db/reviews';
import { getTopMovies } from '@/db/movies';
import { getRecentlyVisitedMoviesByEmail } from '@/db/movieVisits';

type LatestReview = Awaited<ReturnType<typeof getLatestReviews>>[number];
type TopMovie = Awaited<ReturnType<typeof getTopMovies>>[number];
type LastVisited = Awaited<
	ReturnType<typeof getRecentlyVisitedMoviesByEmail>
>[number];

const Home = async () => {
	const session = await getServerSession(authOptions);
	const isLoggedIn = !!session;

	let latestReviews: LatestReview[] = [];
	let lastVisited: LastVisited[] = [];
	const topMovies: TopMovie[] = await getTopMovies(3);

	if (isLoggedIn && session.user?.email) {
		latestReviews = await getLatestReviews(session.user.email, 2);
		lastVisited = await getRecentlyVisitedMoviesByEmail(session.user.email, 2);
	}

	return (
		<main className="mx-auto max-w-7xl px-6 py-10 text-white">
			<h1 className="mb-10 text-4xl font-bold text-white">Movie Tracker</h1>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				{isLoggedIn && (
					<div className="flex flex-col gap-6 lg:col-span-1">
						<div className="h-44 rounded-xl bg-gray-800/60 p-4 shadow-md">
							<h2 className="mb-3 text-lg font-semibold text-white">
								Latest Reviews
							</h2>
							{latestReviews.length === 0 ? (
								<p className="text-gray-400">No reviews yet</p>
							) : (
								latestReviews.map(review => (
									<div key={review.id} className="mb-2 text-gray-300">
										<div className="font-semibold">
											{review.movieTitle ?? `Movie #${review.movieId}`}
											{review.movieYear ? ` (${review.movieYear})` : ''} —{' '}
											{review.rating}/100
										</div>
										<div className="text-sm text-gray-400">
											{review.text.length > 40
												? `${review.text.slice(0, 40)}...`
												: review.text}
										</div>
									</div>
								))
							)}
						</div>

						{/* Last Visited */}
						<div className="h-44 rounded-xl bg-gray-800/60 p-4 shadow-md">
							<h2 className="mb-3 text-lg font-semibold text-white">
								Last Visited
							</h2>
							{lastVisited.length === 0 ? (
								<p className="text-gray-400">No visits yet</p>
							) : (
								lastVisited.map(v => (
									<div
										key={`${v.id}-${v.visitedAt}`}
										className="mb-2 text-gray-300"
									>
										<div className="font-semibold">
											{v.title}
											{v.year ? ` (${v.year})` : ''}
										</div>
										<div className="text-sm text-gray-400">
											{new Date(v.visitedAt * 1000).toLocaleString('cs-CZ')}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}

				<div className={isLoggedIn ? 'lg:col-span-2' : 'lg:col-span-4'}>
					<div className="rounded-xl bg-gray-800/60 p-6 shadow-md">
						<h2 className="mb-4 text-lg font-semibold text-white">
							Top Movies
						</h2>

						<div className="flex flex-col gap-4">
							{topMovies.length === 0 ? (
								<div className="flex h-32 items-center justify-center rounded-xl bg-gray-700/40 text-gray-400">
									No rated movies yet
								</div>
							) : (
								topMovies.map(m => (
									<div
										key={m.id}
										className="flex items-center justify-between rounded-lg bg-gray-700/40 p-4 text-gray-300"
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
						<div className="h-[400px] rounded-xl bg-gray-800/60 p-4 shadow-md">
							<h2 className="mb-3 text-lg font-semibold text-white">
								Continue Watching
							</h2>
							<p className="text-gray-300">Movie A - placeholder</p>
							<p className="text-gray-300">Movie B - placeholder</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default Home;
