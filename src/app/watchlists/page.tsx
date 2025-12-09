import { getServerSession } from 'next-auth/next';
import Link from 'next/link';

import { authOptions } from '@/auth';
import { deleteUserWatchlistAction } from '@/actions/watchlist/delete-watchlist';
import { favouriteWatchlistAction } from '@/actions/watchlist/favourite-watchlist';
import UserWatchlistsPage from '@/components/watchlist/user-watchlists';
import { getWatchlistsWithItemsAction } from '@/actions/watchlist/get-watchlists-with-items';

const UserListsPage = async () => {
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

	const watchlists = await getWatchlistsWithItemsAction();

	return (
		<UserWatchlistsPage
			watchlistsArray={watchlists ?? []}
			favouriteWatchlist={favouriteWatchlistAction}
			deleteWatchlist={deleteUserWatchlistAction}
		/>
	);
};

export default UserListsPage;
