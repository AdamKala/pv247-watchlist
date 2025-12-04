import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
	deleteWatchlist,
	getUserWatchlists,
	toggleFavouriteWatchlist
} from '@/db/watchlists';
import UserWatchlists from '@/components/account/user-watchlist';
import ProfileInfo from '@/components/account/profile-info';
import AddWatchlist from '@/components/account/add-watchlist';
import { getDescription, updateProfile } from '@/db/account';
import type { Watchlist } from '@/lib/movies';
import type { Account } from '@/lib/account';

const editProfile = async (formData: FormData) => {
	'use server';
	await updateProfile(formData);
};

const favouriteWatchlist = async (
	watchlistId: number,
	isFavourite: boolean
) => {
	'use server';
	await toggleFavouriteWatchlist(watchlistId, isFavourite);
};

const deleteUserWatchlist = async (watchlistId: number) => {
	'use server';
	await deleteWatchlist(watchlistId);
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

	const user: Account = {
		name: session.user.name ?? '',
		email: session.user.email,
		image: session.user.image ?? null,
		description: (await getDescription(session.user.email)) ?? ''
	};

	const watchlists: Watchlist[] = await getUserWatchlists(session.user.email);

	return (
		<div className="space-y-6 p-8">
			<ProfileInfo user={user} updateProfile={editProfile} />
			<AddWatchlist />
			<UserWatchlists
				watchlists={watchlists}
				favouriteWatchlist={favouriteWatchlist}
				onDelete={deleteUserWatchlist}
			/>
		</div>
	);
};

export default Dashboard;
