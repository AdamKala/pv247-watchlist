import { getServerSession } from 'next-auth/next';
import Link from 'next/link';

import { type Movie } from '@/lib/movies';
import { authOptions } from '@/auth';
import { isMovieWatchedBy, trackMovieVisit } from '@/db/movieVisits';
import { SeenStatusClient } from '@/components/movies/seen-status-client';

const MovieCard = async ({ movie }: { movie: Movie }) => {
	const csfdDateTime = movie.csfdLastFetched
		? new Date(movie.csfdLastFetched).toLocaleDateString()
		: '';
	const session = await getServerSession(authOptions);

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
	const userEmail: string = session.user.email;

	await trackMovieVisit(userEmail, movie.id);

	const watched = await isMovieWatchedBy(userEmail, movie.id);
	const initialWatchedAt = watched?.movieSeenAt ?? null;

	return (
		<div className="movie-card rounded-xl bg-gray-900 px-5 py-6 text-gray-300">
			<h1 className="mb-3.5 text-4xl font-bold">{movie.title}</h1>
			<div className="grid grid-cols-3">
				<section className="overflow-hidden">
					<div className="w-full">
						{movie.image ? (
							<img
								src={movie.image}
								alt="cover"
								className="h-full w-full object-cover"
							/>
						) : (
							<img
								className="h-full w-full object-cover"
								src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
								alt="cover"
							/>
						)}
					</div>
				</section>
				<section className="col-span-2 px-4">
					<SeenStatusClient
						userEmail={userEmail}
						movieId={movie.id}
						initialWatchedAt={initialWatchedAt}
					/>
					<div className="py-1 capitalize">{movie.type}</div>
					<div className="py-1">
						<span className="font-bold">Genres:</span> {movie.genres}
					</div>
					<div className="py-1">
						<span className="font-bold">Duration:</span> {movie.duration}
					</div>
					<div className="py-1">
						<span className="font-bold">Origins:</span> {movie.origins}
					</div>
					<div className="py-1">
						<span className="font-bold">CSFD Rating:</span> {movie.csfdRating}%{' '}
						<span className="text-xs">({csfdDateTime})</span>
					</div>
					<div className="py-1">{movie.description}</div>
				</section>
			</div>
		</div>
	);
};

export default MovieCard;
