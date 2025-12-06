import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import UserWatchlists from '@/components/account/user-watchlist';
import ProfileInfo from '@/components/account/profile-info';
import AddWatchlist from '@/components/account/add-watchlist';
import { getDescription } from '@/db/account';
import type { Account } from '@/lib/account';
import { deleteUserWatchlistAction } from '@/actions/watchlist/delete-watchlist';
import { favouriteWatchlistAction } from '@/actions/watchlist/favourite-watchlist';
import { editProfileAction } from '@/actions/profile/edit-profile';
import { getWatchlistsAction } from '@/actions/watchlist/get-watchlists';

const Dashboard = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const user: Account = {
		name: session.user.name ?? '',
		email: session.user.email,
		image: session.user.image ?? null,
		description: (await getDescription(session.user.email)) ?? ''
	};

	const watchlists = await getWatchlistsAction();

	return (
		<div className="space-y-6 p-8">
			<ProfileInfo user={user} updateProfile={editProfileAction} />
			<AddWatchlist />
			<UserWatchlists
				watchlists={watchlists ?? []}
				favouriteWatchlist={favouriteWatchlistAction}
				onDelete={deleteUserWatchlistAction}
			/>
		</div>
	);
};

export default Dashboard;
