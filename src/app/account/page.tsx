import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserMovies } from '@/db/watchlists';
import MovieList from '@/components/movie-list';

type Movie = {
	id: number;
	itemSymbol: string;
	watchlistName: string | null;
};

const Dashboard = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return <p>Not authorized</p>;
	}

	const movies: Movie[] = await getUserMovies(session.user.email);

	return (
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
			<p className="mb-4">Welcome, {session.user.name}</p>

			<MovieList movies={movies} />
		</div>
	);
};

export default Dashboard;
