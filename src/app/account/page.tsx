import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserMovies } from '@/db/watchlists';
import MovieList from '@/components/movie-list';
import ProfileInfo from '@/components/account/profile-info';

type Movie = {
	id: number;
	itemSymbol: string;
	watchlistName: string | null;
};

const Dashboard = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const movies: Movie[] = await getUserMovies(session.user.email);

	return (
		<div className="space-y-6 p-8">
			<ProfileInfo session={session} />
			<MovieList movies={movies} />
		</div>
	);
};

export default Dashboard;
