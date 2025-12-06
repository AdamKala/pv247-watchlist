import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import { getLatestReviews } from '@/db/reviews';
import { getTopMovies } from '@/db/movies';
import { getRecentlyVisitedMoviesByEmail } from '@/db/movieVisits';
import HomePage from '@/components/homepage/HomePage';

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
		<HomePage
			isLoggedIn={isLoggedIn}
			topMovies={topMovies}
			latestReviews={latestReviews}
			lastVisited={lastVisited}
		/>
	);
};

export default Home;
