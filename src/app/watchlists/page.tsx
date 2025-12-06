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
			<div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-900 text-white">
				<p className="text-2xl font-bold text-red-500">Access Denied</p>
				<p className="text-center text-gray-300">
					You need to log in to view your watchlists. Please sign in to
					continue.
				</p>
				<Link
					href="/login"
					className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
				>
					Sign In
				</Link>
			</div>
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
